import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "../../../../../Backend/lib/db";
import Student from "../../../../../Backend/lib/models/Student";
import Assignment from "../../../../../Backend/lib/models/Assignment";
import Submission from "../../../../../Backend/lib/models/Submission";
import { uploadImageToCloudinary } from "../../../../../Backend/lib/utils/cloudinary";
import { getStudentContext } from "../_utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function errorJson(message, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

function computeStatus(assignment, submission) {
  if (submission) {
    if (submission.status === "Reviewed") return "Reviewed";
    if (assignment?.dueAt && submission.submittedAt && submission.submittedAt > assignment.dueAt) return "Late";
    return "Submitted";
  }
  if (assignment?.dueAt && new Date() > assignment.dueAt) return "Late";
  return "Pending";
}

export async function GET(req) {
  try {
    const auth = getStudentContext(req);
    if (auth.error) return errorJson(auth.error, auth.status);

    await connectDB();

    const student = await Student.findOne({
      _id: auth.studentObjectId,
      instituteId: auth.instituteObjectId,
      isActive: true,
    })
      .select("classId")
      .lean();

    if (!student?.classId) {
      return NextResponse.json({ success: true, data: [] });
    }

    const assignments = await Assignment.find({
      instituteId: auth.instituteObjectId,
      classId: student.classId,
    })
      .sort({ createdAt: -1 })
      .lean();

    const assignmentIds = assignments.map((a) => a._id);
    const submissions = await Submission.find({
      instituteId: auth.instituteObjectId,
      assignmentId: { $in: assignmentIds },
      studentId: auth.studentObjectId,
    }).lean();

    const submissionMap = new Map(submissions.map((s) => [String(s.assignmentId), s]));

    const normalized = assignments.map((row) => {
      const submission = submissionMap.get(String(row._id));
      return {
        id: String(row._id),
        title: row.title,
        description: row.description || "",
        note: row.note || "",
        dueAt: row.dueAt || null,
        attachments: Array.isArray(row.attachments) ? row.attachments : [],
        createdAt: row.createdAt,
        status: computeStatus(row, submission),
        submission: submission
          ? {
              id: String(submission._id),
              textResponse: submission.textResponse || "",
              attachments: Array.isArray(submission.attachments) ? submission.attachments : [],
              grade: submission.grade ?? null,
              feedback: submission.feedback || "",
              submittedAt: submission.submittedAt,
              reviewedAt: submission.reviewedAt || null,
            }
          : null,
      };
    });

    return NextResponse.json({ success: true, data: normalized });
  } catch (error) {
    return errorJson(error?.message || "Failed to load assignments", 500);
  }
}

export async function POST(req) {
  try {
    const auth = getStudentContext(req);
    if (auth.error) return errorJson(auth.error, auth.status);

    await connectDB();

    const formData = await req.formData();
    const assignmentId = formData.get("assignmentId")?.toString?.().trim();
    const textResponse = formData.get("textResponse")?.toString?.().trim() || "";

    if (!assignmentId || !mongoose.Types.ObjectId.isValid(assignmentId)) {
      return errorJson("Invalid assignment id", 400);
    }

    const assignment = await Assignment.findOne({
      _id: new mongoose.Types.ObjectId(assignmentId),
      instituteId: auth.instituteObjectId,
    });

    if (!assignment) return errorJson("Assignment not found", 404);

    const student = await Student.findOne({
      _id: auth.studentObjectId,
      instituteId: auth.instituteObjectId,
      isActive: true,
    })
      .select("classId")
      .lean();

    if (!student?.classId || String(student.classId) !== String(assignment.classId)) {
      return errorJson("Assignment not assigned to your class", 403);
    }

    const files = formData.getAll("attachments");
    const attachments = [];
    for (const file of files) {
      if (file instanceof File && file.size > 0) {
        const url = await uploadImageToCloudinary(file, {
          folder: `foresty-academics/assignment-submissions/${String(auth.instituteObjectId)}`,
        });
        attachments.push({
          url,
          name: file.name || "",
          type: file.type || "",
        });
      }
    }

    const submittedAt = new Date();
    const status = assignment.dueAt && submittedAt > assignment.dueAt ? "Late" : "Submitted";

    const submission = await Submission.findOneAndUpdate(
      {
        instituteId: auth.instituteObjectId,
        assignmentId: assignment._id,
        studentId: auth.studentObjectId,
      },
      {
        $set: {
          classId: assignment.classId,
          teacherId: assignment.teacherId,
          textResponse,
          attachments,
          status,
          submittedAt,
        },
      },
      { upsert: true, new: true }
    ).lean();

    return NextResponse.json({ success: true, data: { id: String(submission._id) } }, { status: 201 });
  } catch (error) {
    return errorJson(error?.message || "Failed to submit assignment", 500);
  }
}
