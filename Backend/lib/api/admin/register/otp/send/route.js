import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "../../../../../db";
import Admin from "../../../../../models/Admin";
import AdminOtp from "../../../../../models/AdminOtp";
import { sendOtpEmail } from "../../../../../utils/mailer";

const OTP_LENGTH = 6;
const OTP_TTL_MS = 10 * 60 * 1000;

function hashOtp(otp) {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000)).slice(0, OTP_LENGTH);
}

export async function POST(req) {
  try {
    const { email } = await req.json();
    const trimmedEmail = email?.toString?.().trim()?.toLowerCase();

    if (!trimmedEmail) {
      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return NextResponse.json({ success: false, message: "Invalid email format" }, { status: 400 });
    }

    await connectDB();

    const existingAdmin = await Admin.findOne({ email: trimmedEmail }).lean();
    if (existingAdmin) {
      return NextResponse.json({ success: false, message: "Admin already exists with this email" }, { status: 409 });
    }

    const otp = generateOtp();
    const otpHash = hashOtp(otp);
    const expiresAt = new Date(Date.now() + OTP_TTL_MS);

    await AdminOtp.findOneAndUpdate(
      { email: trimmedEmail },
      {
        $set: {
          otpHash,
          expiresAt,
          attempts: 0,
          verifiedAt: null,
        },
      },
      { upsert: true, returnDocument: "after" }
    );

    if (process.env.NODE_ENV !== "production") {
      console.log(`[OTP][admin-register] ${trimmedEmail}: ${otp}`);
    }

    await sendOtpEmail({ to: trimmedEmail, otp });

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
      ...(process.env.NODE_ENV !== "production" && { devOtp: otp }),
    });
  } catch (error) {
    console.error("Send OTP error:", error);
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
