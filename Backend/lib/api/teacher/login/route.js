import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Teacher from "../../../models/Teacher";
import { connectDB } from "../../../db";

export async function POST(req) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password required" },
        { status: 400 }
      );
    }

    const teacher = await Teacher.findOne({
      email: email.toLowerCase().trim(),
    }).select("+password");

    if (!teacher) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    if (!process.env.JWT_SECRET) {
      return NextResponse.json(
        { success: false, message: "JWT secret is not configured" },
        { status: 500 }
      );
    }

    if (!teacher.isActive) {
      return NextResponse.json(
        { success: false, message: "Account disabled" },
        { status: 403 }
      );
    }

    const token = jwt.sign(
      {
        id: String(teacher._id),
        role: teacher.role,
        instituteId: String(teacher.instituteId),
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d", algorithm: "HS256" }
    );
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
    });

    response.cookies.set("teacherToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Teacher login error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
