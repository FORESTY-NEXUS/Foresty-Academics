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
          teacher: base.teacher,
          assignedClasses: [],
          currentClass: null,
          students: [],
        },
      });
    }

    const students = await Student.find({
      instituteId: auth.instituteObjectId,
      classId: currentClass._id,
      isActive: true,
    })
      .select("fullName rollNumber fatherName address phoneNumber feesStatus pendingFees profilePhoto")
      .sort({ rollNumber: 1, createdAt: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        teacher: base.teacher,
        assignedClasses: base.assignedClasses,
        currentClass,
        students,
      },
    });
  } catch (error) {
    return errorJson(error?.message || "Failed to fetch students", 500);
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
    if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
      return errorJson("Invalid student id", 400);
    }

    const update = {};
    if (typeof body.fullName === "string") update.fullName = body.fullName.trim();
    if (typeof body.rollNumber === "string") update.rollNumber = body.rollNumber.trim();
    if (typeof body.fatherName === "string") update.fatherName = body.fatherName.trim();
    if (typeof body.address === "string") update.address = body.address.trim();
    if (typeof body.phoneNumber === "string") update.phoneNumber = body.phoneNumber.trim();

    const classIds = base.assignedClasses.map((c) => c._id);
    const student = await Student.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(studentId),
        instituteId: auth.instituteObjectId,
        classId: { $in: classIds },
        isActive: true,
      },
      { $set: update },
      { new: true, runValidators: true }
    ).lean();

    if (!student) return errorJson("Student not found in your class", 404);
    return NextResponse.json({ success: true, data: student });
  } catch (error) {
    if (error?.code === 11000) {
      return errorJson("Roll number already exists in this institute", 409);
    }
    return errorJson(error?.message || "Failed to update student", 500);
  }
}

export async function DELETE(req) {
  try {
    const auth = getTeacherContext(req);
    if (auth.error) return errorJson(auth.error, auth.status);

    await connectDB();
    const base = await getTeacherAndClasses(auth);
    if (base.error) return errorJson(base.error, base.status);
    if (!base.assignedClasses.length) return errorJson("No class assigned to this teacher", 400);

    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");
    if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
      return errorJson("Invalid student id", 400);
    }

    const classIds = base.assignedClasses.map((c) => c._id);
    const deleted = await Student.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(studentId),
        instituteId: auth.instituteObjectId,
        classId: { $in: classIds },
        isActive: true,
      },
      { $set: { isActive: false } },
      { new: true }
    ).lean();

    if (!deleted) return errorJson("Student not found in your class", 404);
    return NextResponse.json({ success: true });
  } catch (error) {
    return errorJson(error?.message || "Failed to delete student", 500);
  }
}
