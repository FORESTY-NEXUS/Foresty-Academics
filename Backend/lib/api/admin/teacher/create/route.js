import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { connectDB } from "../../../../db";
import Teacher from "../../../../models/Teacher";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SALT_ROUNDS = 12;

export async function POST(req) {
  try {
    if (!process.env.JWT_SECRET) {
      return NextResponse.json(
        { success: false, message: "JWT secret is not configured" },
        { status: 500 }
      );
    }

    const token = req.cookies.get("adminToken")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    if (!payload?.id || payload.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    const adminId = typeof payload.id === "string" ? payload.id : payload.id?.toString?.();
    const instituteId =
      typeof payload.instituteId === "string"
        ? payload.instituteId
        : payload.instituteId?.toString?.();

    if (!adminId || !instituteId) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid admin token context",
        },
        { status: 401 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(adminId) || !mongoose.Types.ObjectId.isValid(instituteId)) {
      return NextResponse.json(
        { success: false, message: "Invalid admin token context" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const fullName = body?.fullName?.trim();
    const email = body?.email?.toLowerCase()?.trim();
    const password = body?.password?.trim();

    if (!fullName || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "fullName, email and password are required",
        },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email format" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    await connectDB();

    const existing = await Teacher.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Teacher email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    await Teacher.create({
      fullName,
      email,
      password: hashedPassword,
      instituteId: new mongoose.Types.ObjectId(instituteId),
      createdBy: new mongoose.Types.ObjectId(adminId),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Teacher created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create teacher error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error",
        ...(process.env.NODE_ENV !== "production" && { error: error?.message }),
      },
      { status: 500 }
    );
  }
}
