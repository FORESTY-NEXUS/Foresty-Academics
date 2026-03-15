import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "../../../../../../Backend/lib/db";
import Student from "../../../../../../Backend/lib/models/Student";
import Assignment from "../../../../../../Backend/lib/models/Assignment";
import Submission from "../../../../../../Backend/lib/models/Submission";
import Notification from "../../../../../../Backend/lib/models/Notification";
import { getTeacherContext, getTeacherAndClasses } from "../../_utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function errorJson(message, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

export async function GET(req) {
  try {
    const auth = getTeacherContext(req);
    if (auth.error) return errorJson(auth.error, auth.status);

    await connectDB();
    const base = await getTeacherAndClasses(auth);
    if (base.error) return errorJson(base.error, base.status);

    const { searchParams } = new URL(req.url);
    const assignmentId = searchParams.get("assignmentId");
    if (!assignmentId || !mongoose.Types.ObjectId.isValid(assignmentId)) {
      return errorJson("Invalid assignment id", 400);
    }

    const assignment = await Assignment.findOne({
      _id: new mongoose.Types.ObjectId(assignmentId),
      instituteId: auth.instituteObjectId,
      teacherId: auth.teacherObjectId,
    }).lean();

    if (!assignment) return errorJson("Assignment not found", 404);

    const submissions = await Submission.find({
      instituteId: auth.instituteObjectId,
      assignmentId: assignment._id,
    })
      .sort({ submittedAt: -1 })
      .lean();

    const studentIds = [...new Set(submissions.map((s) => String(s.studentId)))];
    const students = await Student.find({ _id: { $in: studentIds } })
      .select("fullName rollNumber")
      .lean();

    const studentMap = new Map(students.map((s) => [String(s._id), s]));

    const normalized = submissions.map((row) => {
      const student = studentMap.get(String(row.studentId));
      return {
        id: String(row._id),
        studentId: String(row.studentId),
        studentName: student?.fullName || "",
        rollNumber: student?.rollNumber || "",
        textResponse: row.textResponse || "",
        attachments: Array.isArray(row.attachments) ? row.attachments : [],
        status: row.status,
        grade: row.grade ?? null,
        feedback: row.feedback || "",
        submittedAt: row.submittedAt,
        reviewedAt: row.reviewedAt || null,
      };
    });

    return NextResponse.json({ success: true, data: normalized });
  } catch (error) {
    return errorJson(error?.message || "Failed to load submissions", 500);
  }
}

export async function PATCH(req) {
  try {
    const auth = getTeacherContext(req);
    if (auth.error) return errorJson(auth.error, auth.status);

    await connectDB();
    const base = await getTeacherAndClasses(auth);
    if (base.error) return errorJson(base.error, base.status);

    const body = await req.json();
    const submissionId = body?.submissionId?.toString?.().trim();
    const grade = body?.grade;
    const feedback = body?.feedback?.toString?.().trim() || "";

    if (!submissionId || !mongoose.Types.ObjectId.isValid(submissionId)) {
      return errorJson("Invalid submission id", 400);
    }

    const submission = await Submission.findOne({
      _id: new mongoose.Types.ObjectId(submissionId),
      instituteId: auth.instituteObjectId,
      teacherId: auth.teacherObjectId,
    });

    if (!submission) return errorJson("Submission not found", 404);

    if (grade !== undefined && grade !== null && grade !== "") {
      const numeric = Number(grade);
      if (!Number.isFinite(numeric)) return errorJson("Grade must be a number", 400);
      submission.grade = numeric;
    }
    if (feedback) submission.feedback = feedback;
    submission.status = "Reviewed";
    submission.reviewedAt = new Date();
    await submission.save();

    await Notification.create({
      instituteId: auth.instituteObjectId,
      classId: submission.classId,
      teacherId: auth.teacherObjectId,
      teacherName: base.teacher?.fullName || "",
      studentId: submission.studentId,
      message: feedback || "Your assignment has been reviewed.",
      kind: "Assignment Feedback",
      contextType: "Assignment",
      contextLabel: "",
      eventDate: "",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return errorJson(error?.message || "Failed to review submission", 500);
  }
}
