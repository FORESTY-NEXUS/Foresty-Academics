import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "../../../../../Backend/lib/db";
import Student from "../../../../../Backend/lib/models/Student";
import { getTeacherContext, getTeacherAndClasses } from "../_utils";

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
          assignedClasses: [],
          currentClass: null,
          students: [],
          summary: {
            paid: 0,
            partial: 0,
            unpaid: 0,
          },
        },
      });
    }

    const students = await Student.find({
      instituteId: auth.instituteObjectId,
      classId: currentClass._id,
      isActive: true,
    })
      .select("fullName rollNumber feesStatus pendingFees")
      .sort({ rollNumber: 1, createdAt: 1 })
      .lean();

    const summary = students.reduce(
      (acc, s) => {
        const key = s.feesStatus || "unpaid";
        if (key === "paid") acc.paid += 1;
        else if (key === "partial") acc.partial += 1;
        else acc.unpaid += 1;
        return acc;
      },
      { paid: 0, partial: 0, unpaid: 0 }
    );

    return NextResponse.json({
      success: true,
      data: {
        assignedClasses: base.assignedClasses,
        currentClass,
        students,
        summary,
      },
    });
  } catch (error) {
    return errorJson(error?.message || "Failed to fetch fees", 500);
  }
}

export async function PATCH(req) {
  try {
    const auth = getTeacherContext(req);
    if (auth.error) return errorJson(auth.error, auth.status);

    await connectDB();
    const base = await getTeacherAndClasses(auth);
    if (base.error) return errorJson(base.error, base.status);
    if (!base.assignedClasses.length) return errorJson("No class assigned to this teacher", 400);

    const body = await req.json();
    const studentId = body?.studentId?.toString?.().trim();
    const feesStatus = body?.feesStatus?.toString?.().trim()?.toLowerCase();
    const pendingFeesRaw = body?.pendingFees;

    if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) return errorJson("Invalid student id", 400);
    if (!["paid", "partial", "unpaid"].includes(feesStatus)) return errorJson("Invalid fee status", 400);

    let pendingFees = Number(pendingFeesRaw);
    if (!Number.isFinite(pendingFees) || pendingFees < 0) pendingFees = 0;
    if (feesStatus === "paid") pendingFees = 0;

    const allowedClassIds = base.assignedClasses.map((c) => c._id);
    const student = await Student.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(studentId),
        instituteId: auth.instituteObjectId,
        classId: { $in: allowedClassIds },
        isActive: true,
      },
      { $set: { feesStatus, pendingFees } },
      { new: true, runValidators: true }
    ).lean();

    if (!student) return errorJson("Student not found in your class", 404);
    return NextResponse.json({ success: true, data: student });
  } catch (error) {
    return errorJson(error?.message || "Failed to update fees", 500);
  }
}

