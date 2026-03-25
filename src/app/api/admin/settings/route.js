import { NextResponse } from "next/server";
import { connectDB } from "../../../../../Backend/lib/db";
import Admin from "../../../../../Backend/lib/models/Admin";
import { getAdminContext } from "../_utils";

export async function GET(req) {
  try {
    const auth = getAdminContext(req);
    if (auth.error) {
      return NextResponse.json({ success: false, message: auth.error }, { status: auth.status });
    }

    await connectDB();
    const admin = await Admin.findById(auth.adminObjectId).select("-password").lean();
    if (!admin) {
      return NextResponse.json({ success: false, message: "Admin not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: admin });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const auth = getAdminContext(req);
    if (auth.error) {
      return NextResponse.json({ success: false, message: auth.error }, { status: auth.status });
    }

    const body = await req.json();
    const { totalFees } = body;

    const updates = {};
    if (totalFees !== undefined) {
      const parsed = Number(totalFees);
      if (!Number.isFinite(parsed) || parsed < 0) {
        return NextResponse.json({ success: false, message: "Invalid total fees amount" }, { status: 400 });
      }
      updates.totalFees = parsed;
    }

    await connectDB();
    const updatedAdmin = await Admin.findByIdAndUpdate(
      auth.adminObjectId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password").lean();

    if (!updatedAdmin) {
      return NextResponse.json({ success: false, message: "Admin not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedAdmin });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
