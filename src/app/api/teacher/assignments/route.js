import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "../../../../../Backend/lib/db";
import Assignment from "../../../../../Backend/lib/models/Assignment";
import Submission from "../../../../../Backend/lib/models/Submission";
import { uploadImageToCloudinary } from "../../../../../Backend/lib/utils/cloudinary";
import { getTeacherContext, getTeacherAndClasses } from "../_utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function errorJson(message, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

function pickCurrentClass(assignedClasses, requestedClassId) {
  if (!assignedClasses.length) return null;
  if (!requestedClassId) return assignedClasses[0];
  return assignedClasses.find((c) => String(c._id) === String(requestedClassId)) || null;
}

export async function GET(req) {
  try {
    const auth = getTeacherContext(req);
    if (auth.error) return errorJson(auth.error, auth.status);

    await connectDB();
    const base = await getTeacherAndClasses(auth);
    if (base.error) return errorJson(base.error, base.status);

    const { searchParams } = new URL(req.url);
    const requestedClassId = searchParams.get("classId");
    const currentClass = pickCurrentClass(base.assignedClasses, requestedClassId);

    if (!currentClass) {
      return NextResponse.json({
        success: true,
        data: {
          assignedClasses: base.assignedClasses,
          currentClass: null,
          assignments: [],
        },
      });
    }

    const assignments = await Assignment.find({
      instituteId: auth.instituteObjectId,
      classId: currentClass._id,
      teacherId: auth.teacherObjectId,
    })
      .sort({ createdAt: -1 })
      .lean();

    const assignmentIds = assignments.map((a) => a._id);
    const submissions = await Submission.find({
      instituteId: auth.instituteObjectId,
      assignmentId: { $in: assignmentIds },
    })
      .select("assignmentId studentId")
      .lean();

    const counts = new Map();
    for (const sub of submissions) {
      const key = String(sub.assignmentId);
      counts.set(key, (counts.get(key) || 0) + 1);
    }

    const normalized = assignments.map((row) => ({
      id: String(row._id),
      title: row.title,
      description: row.description || "",
      note: row.note || "",
      dueAt: row.dueAt || null,
      attachments: Array.isArray(row.attachments) ? row.attachments : [],
      createdAt: row.createdAt,
      submissionsCount: counts.get(String(row._id)) || 0,
    }));

    return NextResponse.json({
      success: true,
      data: {
        assignedClasses: base.assignedClasses,
        currentClass,
        assignments: normalized,
      },
    });
  } catch (error) {
    return errorJson(error?.message || "Failed to load assignments", 500);
  }
}

export async function POST(req) {
  try {
    const auth = getTeacherContext(req);
    if (auth.error) return errorJson(auth.error, auth.status);

    await connectDB();
    const base = await getTeacherAndClasses(auth);
    if (base.error) return errorJson(base.error, base.status);
    if (!base.assignedClasses.length) return errorJson("No class assigned to this teacher", 400);

    const formData = await req.formData();
    const title = formData.get("title")?.toString?.().trim();
    const description = formData.get("description")?.toString?.().trim() || "";
    const note = formData.get("note")?.toString?.().trim() || "";
    const dueAtRaw = formData.get("dueAt")?.toString?.().trim();
    const classId = formData.get("classId")?.toString?.().trim();

    if (!title) return errorJson("Title is required", 400);
    if (!classId || !mongoose.Types.ObjectId.isValid(classId)) return errorJson("Invalid class id", 400);

    const currentClass = base.assignedClasses.find((c) => String(c._id) === classId);
    if (!currentClass) return errorJson("Class not found in your account", 404);

    const files = formData.getAll("attachments");
    const attachments = [];
    for (const file of files) {
      if (file instanceof File && file.size > 0) {
        const url = await uploadImageToCloudinary(file, {
          folder: `foresty-academics/assignments/${String(auth.instituteObjectId)}`,
        });
        attachments.push({
          url,
          name: file.name || "",
          type: file.type || "",
        });
      }
    }

    const dueAt = dueAtRaw ? new Date(dueAtRaw) : null;

    const assignment = await Assignment.create({
      instituteId: auth.instituteObjectId,
      classId: currentClass._id,
      teacherId: auth.teacherObjectId,
      title,
      description,
      note,
      dueAt: dueAt && !Number.isNaN(dueAt.getTime()) ? dueAt : null,
      attachments,
    });

    return NextResponse.json({ success: true, data: { id: String(assignment._id) } }, { status: 201 });
  } catch (error) {
    return errorJson(error?.message || "Failed to create assignment", 500);
  }
}
