import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export function getStudentContext(req) {
  if (!process.env.JWT_SECRET) {
    return { error: "JWT secret is not configured", status: 500 };
  }

  const token = req.cookies.get("studentToken")?.value;
  if (!token) {
    return { error: "Unauthorized", status: 401 };
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });
  } catch {
    return { error: "Invalid or expired token", status: 401 };
  }

  if (!payload?.id || payload.role !== "student") {
    return { error: "Forbidden", status: 403 };
  }

  const studentId = typeof payload.id === "string" ? payload.id : payload.id?.toString?.();
  const instituteId =
    typeof payload.instituteId === "string"
      ? payload.instituteId
      : payload.instituteId?.toString?.();

  if (!studentId || !instituteId) {
    return { error: "Invalid student token context", status: 401 };
  }

  if (!mongoose.Types.ObjectId.isValid(studentId) || !mongoose.Types.ObjectId.isValid(instituteId)) {
    return { error: "Invalid student token context", status: 401 };
  }

  return {
    studentObjectId: new mongoose.Types.ObjectId(studentId),
    instituteObjectId: new mongoose.Types.ObjectId(instituteId),
  };
}
