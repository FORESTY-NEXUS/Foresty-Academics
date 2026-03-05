import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { connectDB } from "../../../../../Backend/lib/db";
import Teacher from "../../../../../Backend/lib/models/Teacher";

function getAdminInstituteObjectId(req) {
  if (!process.env.JWT_SECRET) {
    return { error: "JWT secret is not configured", status: 500 };
  }

  const token = req.cookies.get("adminToken")?.value;
  if (!token) {
    return { error: "Unauthorized", status: 401 };
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });
  } catch {
    return { error: "Invalid or expired token", status: 401 };
  }

  if (payload?.role !== "admin") {
    return { error: "Forbidden", status: 403 };
  }

  const instituteId =
    typeof payload?.instituteId === "string"
      ? payload.instituteId
      : payload?.instituteId?.toString?.();

  if (!instituteId || !mongoose.Types.ObjectId.isValid(instituteId)) {
    return { error: "Invalid admin token context", status: 401 };
  }

  return { instituteObjectId: new mongoose.Types.ObjectId(instituteId) };
}

export async function GET(req) {
  try {
    const auth = getAdminInstituteObjectId(req);
    if (auth.error) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    await connectDB();
    const teachers = await Teacher.find({
      isActive: true,
      instituteId: auth.instituteObjectId,
    }).lean();

    return NextResponse.json({ success: true, data: teachers });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
