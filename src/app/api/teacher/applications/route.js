import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "../../../../../Backend/lib/db";
import Student from "../../../../../Backend/lib/models/Student";
import ClassModel from "../../../../../Backend/lib/models/Class";
import Application from "../../../../../Backend/lib/models/Application";
import Notification from "../../../../../Backend/lib/models/Notification";
import { getTeacherContext, getTeacherAndClasses } from "../_utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function errorJson(message, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

export async function GET(req) {
  try {
    const auth = getTeacherContext(req);
    if (auth.error) return errorJson(auth.error, auth.status);

    await connectDB();
    const base = await getTeacherAndClasses(auth);
    if (base.error) return errorJson(base.error, base.status);

    const allowedClassIds = base.assignedClasses.map((c) => c._id);

    const applications = await Application.find({
      instituteId: auth.instituteObjectId,
      classId: { $in: allowedClassIds },
    })
      .sort({ createdAt: -1 })
      .lean();

    const studentIds = [...new Set(applications.map((a) => String(a.studentId)))];
    const classIds = [...new Set(applications.map((a) => String(a.classId)))];

    const [students, classes] = await Promise.all([
      Student.find({ _id: { $in: studentIds } })
        .select("fullName rollNumber")
        .lean(),
      ClassModel.find({ _id: { $in: classIds } })
        .select("name year")
        .lean(),
    ]);

    const studentMap = new Map(students.map((s) => [String(s._id), s]));
    const classMap = new Map(classes.map((c) => [String(c._id), c]));

    const normalized = applications.map((row) => {
      const student = studentMap.get(String(row.studentId));
      const cls = classMap.get(String(row.classId));
      return {
        id: String(row._id),
        studentId: String(row.studentId),
        studentName: student?.fullName || "",
        rollNumber: student?.rollNumber || "",
        classLabel: cls ? `${cls.name} (${cls.year})` : "",
        type: row.type,
        subject: row.subject,
        message: row.message,
        startDate: row.startDate || "",
        endDate: row.endDate || "",
        attachmentUrl: row.attachmentUrl || "",
        status: row.status,
        replyMessage: row.replyMessage || "",
        repliedAt: row.repliedAt || null,
        createdAt: row.createdAt,
      };
    });

    return NextResponse.json({ success: true, data: normalized });
  } catch (error) {
    return errorJson(error?.message || "Failed to load applications", 500);
  }
}

export async function PATCH(req) {
  try {
    const auth = getTeacherContext(req);
    if (auth.error) return errorJson(auth.error, auth.status);

    await connectDB();
    const base = await getTeacherAndClasses(auth);
    if (base.error) return errorJson(base.error, base.status);

    const body = await req.json();
    const applicationId = body?.applicationId?.toString?.().trim();
    const status = body?.status?.toString?.().trim();
    const replyMessage = body?.replyMessage?.toString?.().trim() || "";

    if (!applicationId || !mongoose.Types.ObjectId.isValid(applicationId)) return errorJson("Invalid application id", 400);
    if (!status || !["Pending", "Approved", "Rejected"].includes(status)) return errorJson("Invalid status", 400);

    const allowedClassIds = base.assignedClasses.map((c) => c._id);

    const application = await Application.findOne({
      _id: new mongoose.Types.ObjectId(applicationId),
      instituteId: auth.instituteObjectId,
      classId: { $in: allowedClassIds },
    });

    if (!application) return errorJson("Application not found", 404);

    application.status = status;
    if (replyMessage) application.replyMessage = replyMessage;
    application.repliedAt = new Date();
    await application.save();

    const notifyMessage = replyMessage
      ? `Application ${status}: ${replyMessage}`
      : `Your application has been ${status.toLowerCase()}.`;

    await Notification.create({
      instituteId: auth.instituteObjectId,
      classId: application.classId,
      teacherId: auth.teacherObjectId,
      teacherName: base.teacher?.fullName || "",
      studentId: application.studentId,
      message: notifyMessage,
      kind: "Application Update",
      contextType: "Application",
      contextLabel: application.subject,
      eventDate: "",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return errorJson(error?.message || "Failed to update application", 500);
  }
}
