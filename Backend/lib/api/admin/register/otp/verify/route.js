import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "../../../../../db";
import AdminOtp from "../../../../../models/AdminOtp";

const MAX_ATTEMPTS = 5;

function hashOtp(otp) {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

export async function POST(req) {
  try {
    const { email, otp } = await req.json();
    const trimmedEmail = email?.toString?.().trim()?.toLowerCase();
    const trimmedOtp = otp?.toString?.().trim();

    if (!trimmedEmail || !trimmedOtp) {
      return NextResponse.json({ success: false, message: "Email and OTP are required" }, { status: 400 });
    }

    if (!/^\d{6}$/.test(trimmedOtp)) {
      return NextResponse.json({ success: false, message: "OTP must be 6 digits" }, { status: 400 });
    }

    await connectDB();

    const otpRecord = await AdminOtp.findOne({ email: trimmedEmail });
    if (!otpRecord) {
      return NextResponse.json({ success: false, message: "OTP not found. Please resend OTP." }, { status: 404 });
    }

    if (otpRecord.expiresAt.getTime() < Date.now()) {
      return NextResponse.json({ success: false, message: "OTP has expired. Please resend OTP." }, { status: 400 });
    }

    if (otpRecord.attempts >= MAX_ATTEMPTS) {
      return NextResponse.json({ success: false, message: "Too many attempts. Please resend OTP." }, { status: 429 });
    }

    const isMatch = otpRecord.otpHash === hashOtp(trimmedOtp);
    if (!isMatch) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      return NextResponse.json({ success: false, message: "Invalid OTP" }, { status: 400 });
    }

    otpRecord.verifiedAt = new Date();
    otpRecord.attempts = 0;
    await otpRecord.save();

    return NextResponse.json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error("Verify OTP error:", error);
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
