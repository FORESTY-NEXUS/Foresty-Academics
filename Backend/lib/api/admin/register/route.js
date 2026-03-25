import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "../../../db";
import Admin from "../../../models/Admin";
import AdminOtp from "../../../models/AdminOtp";

export async function POST(req) {
  try {
    await connectDB();
    const { fullName, email, password, instituteName, phone, location } = await req.json();

    if (!fullName || !email || !password || !instituteName || !phone || !location) {
      return NextResponse.json(
        { message: "All required fields must be provided" },
        { status: 400 }
      );
    }

    const trimmedFullName = fullName.toString().trim();
    const trimmedEmail = email.toLowerCase().trim();
    const trimmedPassword = password.trim();
    const trimmedInstituteName = instituteName.toString().trim();
    const trimmedPhone = phone.toString().trim();
    const trimmedLocation = location.toString().trim();

    if (trimmedFullName.length < 3) {
      return NextResponse.json(
        { message: "Full name must be at least 3 characters" },
        { status: 400 }
      );
    }

    if (trimmedPassword.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    const existing = await Admin.findOne({ email: trimmedEmail });
    if (existing) {
      return NextResponse.json({ message: "Admin already exists" }, { status: 400 });
    }

    // ── Enforce OTP verification ──
    const otpRecord = await AdminOtp.findOne({ email: trimmedEmail });
    if (!otpRecord || !otpRecord.verifiedAt) {
      return NextResponse.json(
        { message: "Email not verified. Please verify OTP first." },
        { status: 403 }
      );
    }
    const VERIFICATION_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
    if (Date.now() - otpRecord.verifiedAt.getTime() > VERIFICATION_WINDOW_MS) {
      return NextResponse.json(
        { message: "OTP verification expired. Please verify again." },
        { status: 403 }
      );
    }


    const hashed = await bcrypt.hash(trimmedPassword, 12);
    const admin = await Admin.create({
      fullName: trimmedFullName,
      email: trimmedEmail,
      password: hashed,
      instituteName: trimmedInstituteName,
      phone: trimmedPhone,
      location: trimmedLocation,
      instituteId: new mongoose.Types.ObjectId(),
    });

    // Cleanup OTP record after successful registration
    await AdminOtp.deleteOne({ email: trimmedEmail });

    return NextResponse.json(
      { message: "Admin created successfully", adminId: admin._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin register error:", error);
    return NextResponse.json(
      {
        message: "Server error",
        ...(process.env.NODE_ENV !== "production" && { error: error?.message }),
      },
      { status: 500 }
    );
  }
}
