import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "../../../../../Backend/lib/db";
import Student from "../../../../../Backend/lib/models/Student";
import Notification from "../../../../../Backend/lib/models/Notification";
import { getTeacherContext, getTeacherAndClasses } from "../_utils";

function errorJson(message, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

export async function POST(req) {
  try {
    const auth = getTeacherContext(req);
    if (auth.error) return errorJson(auth.error, auth.status);

    await connectDB();
    const base = await getTeacherAndClasses(auth);
    if (base.error) return errorJson(base.error, base.status);
    if (!base.assignedClasses.length) return errorJson("No class assigned to this teacher", 400);

    const body = await req.json();
    const classId = body?.classId?.toString?.().trim();
    const studentId = body?.studentId?.toString?.().trim();
    const studentIds = Array.isArray(body?.studentIds) ? body.studentIds.map((id) => String(id)) : [];
    const message = body?.message?.toString?.().trim();
    const kind = body?.kind?.toString?.().trim() || "Absent Warning";
    const contextType = body?.contextType?.toString?.().trim() || "";
    const contextLabel = body?.contextLabel?.toString?.().trim() || "";
    const eventDate = body?.eventDate?.toString?.().trim() || "";

    if (!classId || !mongoose.Types.ObjectId.isValid(classId)) return errorJson("Invalid class id", 400);
    if (!message) return errorJson("Message is required", 400);

    const currentClass = base.assignedClasses.find((c) => String(c._id) === classId);
    if (!currentClass) return errorJson("Class not found in your account", 404);

    let targetIds = [];
    if (studentId) targetIds.push(studentId);
    if (studentIds.length) targetIds = targetIds.concat(studentIds);
    targetIds = [...new Set(targetIds.map((id) => id.toString()))];

    if (!targetIds.length) return errorJson("Student id(s) are required", 400);

    const validIds = targetIds.filter((id) => mongoose.Types.ObjectId.isValid(id));
    if (!validIds.length) return errorJson("Invalid student id", 400);

    const students = await Student.find({
      _id: { $in: validIds.map((id) => new mongoose.Types.ObjectId(id)) },
      instituteId: auth.instituteObjectId,
      classId: currentClass._id,
      isActive: true,
    })
      .select("_id")
      .lean();

    if (!students.length) return errorJson("Student not found in this class", 404);

    const docs = students.map((student) => ({
      instituteId: auth.instituteObjectId,
      classId: currentClass._id,
      teacherId: auth.teacherObjectId,
      teacherName: base.teacher?.fullName || "",
      studentId: student._id,
      message,
      kind,
      contextType,
      contextLabel,
      eventDate,
    }));

    const created = await Notification.insertMany(docs);

    return NextResponse.json(
      { success: true, data: { count: created.length } },
      { status: 201 }
    );
  } catch (error) {
    return errorJson(error?.message || "Failed to send notification", 500);
  }
}
