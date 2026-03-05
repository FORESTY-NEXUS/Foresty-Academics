import { NextResponse } from "next/server";
import { connectDB } from "../../../../Backend/lib/db";

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ ok: true, message: "MongoDB connected" });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: "MongoDB connection failed", error: error.message },
      { status: 500 }
    );
  }
}
