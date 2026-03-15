import { NextResponse } from "next/server";
import { connectDB } from "../../../../../Backend/lib/db";
import Notification from "../../../../../Backend/lib/models/Notification";
import { getStudentContext } from "../_utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function errorJson(message, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

export async function GET(req) {
  try {
    const auth = getStudentContext(req);
    if (auth.error) return errorJson(auth.error, auth.status);

    await connectDB();

    const { searchParams } = new URL(req.url);
    const wantsCount = searchParams.get("count") === "1";

    const filter = {
      instituteId: auth.instituteObjectId,
      studentId: auth.studentObjectId,
    };

    if (wantsCount) {
      const total = await Notification.countDocuments({
        ...filter,
        $or: [{ readAt: null }, { readAt: { $exists: false } }],
      });
      return NextResponse.json({ success: true, data: { total } });
    }

    const notifications = await Notification.find(filter)
      .select("message kind contextType contextLabel eventDate teacherName createdAt readAt")
      .sort({ createdAt: -1 })
      .lean();

    const normalized = notifications.map((row) => ({
      id: String(row._id),
      message: row.message,
      kind: row.kind || "",
      contextType: row.contextType || "",
      contextLabel: row.contextLabel || "",
      eventDate: row.eventDate || "",
      teacherName: row.teacherName || "",
      sentAt: row.createdAt,
      readAt: row.readAt || null,
    }));

    return NextResponse.json({ success: true, data: normalized });
  } catch (error) {
    return errorJson(error?.message || "Failed to load notifications", 500);
  }
}

export async function PATCH(req) {
  try {
    const auth = getStudentContext(req);
    if (auth.error) return errorJson(auth.error, auth.status);

    await connectDB();

    const filter = {
      instituteId: auth.instituteObjectId,
      studentId: auth.studentObjectId,
      $or: [{ readAt: null }, { readAt: { $exists: false } }],
    };

    await Notification.updateMany(filter, { $set: { readAt: new Date() } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return errorJson(error?.message || "Failed to mark notifications as read", 500);
  }
}
