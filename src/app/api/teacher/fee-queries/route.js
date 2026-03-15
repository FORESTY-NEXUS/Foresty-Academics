import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "../../../../../Backend/lib/db";
import Student from "../../../../../Backend/lib/models/Student";
import ClassModel from "../../../../../Backend/lib/models/Class";
import FeeQuery from "../../../../../Backend/lib/models/FeeQuery";
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

    const queries = await FeeQuery.find({
      instituteId: auth.instituteObjectId,
      classId: { $in: allowedClassIds },
    })
      .sort({ createdAt: -1 })
      .lean();

    const studentIds = [...new Set(queries.map((q) => String(q.studentId)))];
    const classIds = [...new Set(queries.map((q) => String(q.classId)))];

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

    const normalized = queries.map((row) => {
      const student = studentMap.get(String(row.studentId));
      const cls = classMap.get(String(row.classId));
      return {
        id: String(row._id),
        studentId: String(row.studentId),
        studentName: student?.fullName || "",
        rollNumber: student?.rollNumber || "",
        classLabel: cls ? `${cls.name} (${cls.year})` : "",
        category: row.category,
        message: row.message,
        attachmentUrl: row.attachmentUrl || "",
        status: row.status,
        replyMessage: row.replyMessage || "",
        repliedAt: row.repliedAt || null,
        createdAt: row.createdAt,
      };
    });

    return NextResponse.json({ success: true, data: normalized });
  } catch (error) {
    return errorJson(error?.message || "Failed to load fee queries", 500);
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
    const queryId = body?.queryId?.toString?.().trim();
    const replyMessage = body?.replyMessage?.toString?.().trim();

    if (!queryId || !mongoose.Types.ObjectId.isValid(queryId)) return errorJson("Invalid query id", 400);
    if (!replyMessage) return errorJson("Reply message is required", 400);

    const allowedClassIds = base.assignedClasses.map((c) => c._id);

    const query = await FeeQuery.findOne({
      _id: new mongoose.Types.ObjectId(queryId),
      instituteId: auth.instituteObjectId,
      classId: { $in: allowedClassIds },
    });

    if (!query) return errorJson("Fee query not found", 404);

    query.replyMessage = replyMessage;
    query.status = "Replied";
    query.repliedAt = new Date();
    await query.save();

    await Notification.create({
      instituteId: auth.instituteObjectId,
      classId: query.classId,
      teacherId: auth.teacherObjectId,
      teacherName: base.teacher?.fullName || "",
      studentId: query.studentId,
      message: replyMessage,
      kind: "Fee Query Reply",
      contextType: "Fee Query",
      contextLabel: query.category,
      eventDate: "",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return errorJson(error?.message || "Failed to reply to fee query", 500);
  }
}
