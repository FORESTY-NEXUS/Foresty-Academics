import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "../../../db";
import Student from "../../../models/Student";

export async function POST(req) {
  try {
    await connectDB();

    const { rollNumber, password } = await req.json();
    const normalizedRoll = rollNumber?.trim();
    const normalizedPassword = password?.trim();

    if (!normalizedRoll || !normalizedPassword) {
      return NextResponse.json(
        { success: false, message: "rollNumber and password are required" },
        { status: 400 }
      );
    }

    const student = await Student.findOne({ rollNumber: normalizedRoll }).select("+password");
    if (!student) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(normalizedPassword, student.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    if (!student.isActive) {
      return NextResponse.json(
        { success: false, message: "Account disabled" },
        { status: 403 }
      );
    }

    if (!process.env.JWT_SECRET) {
      return NextResponse.json(
        { success: false, message: "JWT secret is not configured" },
        { status: 500 }
      );
    }

    const token = jwt.sign(
      {
        id: String(student._id),
        role: "student",
        instituteId: String(student.instituteId),
        rollNumber: student.rollNumber,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d", algorithm: "HS256" }
    );

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
    });

    response.cookies.set("studentToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Student login error:", error);
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
