import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "../../../../../Backend/lib/db";
import Student from "../../../../../Backend/lib/models/Student";
import Mark from "../../../../../Backend/lib/models/Mark";
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
          marks: [],
        },
      });
    }

    const students = await Student.find({
      instituteId: auth.instituteObjectId,
      classId: currentClass._id,
      isActive: true,
    })
      .select("fullName rollNumber")
      .sort({ rollNumber: 1, createdAt: 1 })
      .lean();

    const studentIds = students.map((s) => s._id);
    const marks = await Mark.find({
      instituteId: auth.instituteObjectId,
      classId: currentClass._id,
      studentId: { $in: studentIds },
    })
      .select("studentId subject total obtained")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        assignedClasses: base.assignedClasses,
        currentClass,
        students,
        marks,
      },
    });
  } catch (error) {
    return errorJson(error?.message || "Failed to fetch marks", 500);
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

    const body = await req.json();
    const classId = body?.classId?.toString?.().trim();
    const studentId = body?.studentId?.toString?.().trim();
    const subject = body?.subject?.toString?.().trim();
    const total = Number(body?.total);
    const obtained = Number(body?.obtained);

    if (!classId || !mongoose.Types.ObjectId.isValid(classId)) return errorJson("Invalid class id", 400);
    if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) return errorJson("Invalid student id", 400);
    if (!subject) return errorJson("Subject is required", 400);
    if (!Number.isFinite(total) || total <= 0) return errorJson("Total must be greater than 0", 400);
    if (!Number.isFinite(obtained) || obtained < 0 || obtained > total) return errorJson("Obtained must be between 0 and total", 400);

    const currentClass = base.assignedClasses.find((c) => String(c._id) === classId);
    if (!currentClass) return errorJson("Class not found in your account", 404);

    const student = await Student.findOne({
      _id: new mongoose.Types.ObjectId(studentId),
      instituteId: auth.instituteObjectId,
      classId: currentClass._id,
      isActive: true,
    }).lean();
    if (!student) return errorJson("Student not found in this class", 404);

    const mark = await Mark.create({
      instituteId: auth.instituteObjectId,
      classId: currentClass._id,
      teacherId: auth.teacherObjectId,
      studentId: student._id,
      subject,
      total,
      obtained,
    });

    return NextResponse.json({ success: true, data: mark }, { status: 201 });
  } catch (error) {
    return errorJson(error?.message || "Failed to add marks", 500);
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
    const markId = body?.markId?.toString?.().trim();
    if (!markId || !mongoose.Types.ObjectId.isValid(markId)) return errorJson("Invalid mark id", 400);

    const update = {};
    if (typeof body.subject === "string" && body.subject.trim()) update.subject = body.subject.trim();
    if (body.total !== undefined) update.total = Number(body.total);
    if (body.obtained !== undefined) update.obtained = Number(body.obtained);

    if (update.total !== undefined && (!Number.isFinite(update.total) || update.total <= 0)) {
      return errorJson("Total must be greater than 0", 400);
    }
    if (update.obtained !== undefined && !Number.isFinite(update.obtained)) {
      return errorJson("Obtained must be numeric", 400);
    }

    const allowedClassIds = base.assignedClasses.map((c) => c._id);
    const current = await Mark.findOne({
      _id: new mongoose.Types.ObjectId(markId),
      instituteId: auth.instituteObjectId,
      classId: { $in: allowedClassIds },
    });
    if (!current) return errorJson("Mark not found in your class", 404);

    const finalTotal = update.total ?? current.total;
    const finalObtained = update.obtained ?? current.obtained;
    if (finalObtained < 0 || finalObtained > finalTotal) {
      return errorJson("Obtained must be between 0 and total", 400);
    }

    Object.assign(current, update);
    await current.save();
    return NextResponse.json({ success: true, data: current });
  } catch (error) {
    return errorJson(error?.message || "Failed to update marks", 500);
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
    const markId = searchParams.get("markId");
    if (!markId || !mongoose.Types.ObjectId.isValid(markId)) return errorJson("Invalid mark id", 400);

    const allowedClassIds = base.assignedClasses.map((c) => c._id);
    const deleted = await Mark.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(markId),
      instituteId: auth.instituteObjectId,
      classId: { $in: allowedClassIds },
    }).lean();

    if (!deleted) return errorJson("Mark not found in your class", 404);
    return NextResponse.json({ success: true });
  } catch (error) {
    return errorJson(error?.message || "Failed to delete mark", 500);
  }
}

