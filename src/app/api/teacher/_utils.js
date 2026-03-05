import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Teacher from "../../../../Backend/lib/models/Teacher";
import ClassModel from "../../../../Backend/lib/models/Class";

export function getTeacherContext(req) {
  if (!process.env.JWT_SECRET) {
    return { error: "JWT secret is not configured", status: 500 };
  }

  const token = req.cookies.get("teacherToken")?.value;
  if (!token) {
    return { error: "Unauthorized", status: 401 };
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });
  } catch {
    return { error: "Invalid or expired token", status: 401 };
  }

  if (!payload?.id || payload.role !== "teacher") {
    return { error: "Forbidden", status: 403 };
  }

  const teacherId = typeof payload.id === "string" ? payload.id : payload.id?.toString?.();
  const instituteId =
    typeof payload.instituteId === "string"
      ? payload.instituteId
      : payload.instituteId?.toString?.();

  if (!teacherId || !instituteId) {
    return { error: "Invalid teacher token context", status: 401 };
  }

  if (!mongoose.Types.ObjectId.isValid(teacherId) || !mongoose.Types.ObjectId.isValid(instituteId)) {
    return { error: "Invalid teacher token context", status: 401 };
  }

  return {
    teacherObjectId: new mongoose.Types.ObjectId(teacherId),
    instituteObjectId: new mongoose.Types.ObjectId(instituteId),
  };
}

export async function getTeacherAndClasses(auth) {
  const teacher = await Teacher.findOne({
    _id: auth.teacherObjectId,
    instituteId: auth.instituteObjectId,
    isActive: true,
  })
    .select("fullName email")
    .lean();

  if (!teacher) {
    return { error: "Teacher not found", status: 404 };
  }

  const assignedClasses = await ClassModel.find({
    instituteId: auth.instituteObjectId,
    teacherId: auth.teacherObjectId,
    isActive: true,
  })
    .select("name year")
    .sort({ createdAt: 1 })
    .lean();

  return { teacher, assignedClasses };
}

