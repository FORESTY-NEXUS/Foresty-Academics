import { NextResponse } from "next/server";
import { connectDB } from "../../../../../Backend/lib/db";
import Student from "../../../../../Backend/lib/models/Student";
import ClassModel from "../../../../../Backend/lib/models/Class";
import FeeQuery from "../../../../../Backend/lib/models/FeeQuery";
import { uploadImageToCloudinary } from "../../../../../Backend/lib/utils/cloudinary";
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

    const queries = await FeeQuery.find({
      instituteId: auth.instituteObjectId,
      studentId: auth.studentObjectId,
    })
      .select("category message attachmentUrl status replyMessage repliedAt createdAt")
      .sort({ createdAt: -1 })
      .lean();

    const normalized = queries.map((row) => ({
      id: String(row._id),
      category: row.category,
      message: row.message,
      attachmentUrl: row.attachmentUrl || "",
      status: row.status,
      replyMessage: row.replyMessage || "",
      repliedAt: row.repliedAt || null,
      createdAt: row.createdAt,
    }));

    return NextResponse.json({ success: true, data: normalized });
  } catch (error) {
    return errorJson(error?.message || "Failed to load fee queries", 500);
  }
}

export async function POST(req) {
  try {
    const auth = getStudentContext(req);
    if (auth.error) return errorJson(auth.error, auth.status);

    await connectDB();

    const formData = await req.formData();
    const category = formData.get("category")?.toString?.().trim();
    const message = formData.get("message")?.toString?.().trim();
    const attachment = formData.get("attachment");

    if (!category) return errorJson("Category is required", 400);
    if (!message) return errorJson("Message is required", 400);

    const student = await Student.findOne({
      _id: auth.studentObjectId,
      instituteId: auth.instituteObjectId,
      isActive: true,
    })
      .select("classId")
      .lean();

    if (!student?.classId) return errorJson("Student class not assigned", 400);

    const cls = await ClassModel.findOne({
      _id: student.classId,
      instituteId: auth.instituteObjectId,
      isActive: true,
    })
      .select("teacherId")
      .lean();

    if (!cls?.teacherId) return errorJson("Class teacher not assigned", 400);

    let attachmentUrl = "";
    if (attachment instanceof File && attachment.size > 0) {
      attachmentUrl = await uploadImageToCloudinary(attachment, {
        folder: `foresty-academics/fee-queries/${String(auth.instituteObjectId)}`,
      });
    }

    const query = await FeeQuery.create({
      instituteId: auth.instituteObjectId,
      classId: student.classId,
      teacherId: cls.teacherId,
      studentId: auth.studentObjectId,
      category,
      message,
      attachmentUrl,
    });

    return NextResponse.json({ success: true, data: { id: String(query._id) } }, { status: 201 });
  } catch (error) {
    return errorJson(error?.message || "Failed to submit fee query", 500);
  }
}
