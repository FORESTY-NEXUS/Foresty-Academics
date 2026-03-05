import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { connectDB } from "../../../../../Backend/lib/db";
import Teacher from "../../../../../Backend/lib/models/Teacher";
import ClassModel from "../../../../../Backend/lib/models/Class";
import Student from "../../../../../Backend/lib/models/Student";

function unauthorized(message = "Unauthorized", status = 401) {
  return NextResponse.json({ success: false, message }, { status });
}

function getTeacherContext(req) {
  if (!process.env.JWT_SECRET) {
    return { error: "JWT secret is not configured", status: 500 };
  }

  const token = req.cookies.get("teacherToken")?.value;
  if (!token) {
    return { error: "Unauthorized", status: 401 };
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });
  } catch {
    return { error: "Invalid or expired token", status: 401 };
  }

  if (!payload?.id || payload.role !== "teacher") {
    return { error: "Forbidden", status: 403 };
  }

  const teacherId = typeof payload.id === "string" ? payload.id : payload.id?.toString?.();
  const instituteId =
    typeof payload.instituteId === "string"
      ? payload.instituteId
      : payload.instituteId?.toString?.();

  if (!teacherId || !instituteId) {
    return { error: "Invalid teacher token context", status: 401 };
  }

  if (!mongoose.Types.ObjectId.isValid(teacherId) || !mongoose.Types.ObjectId.isValid(instituteId)) {
    return { error: "Invalid teacher token context", status: 401 };
  }

  return {
    teacherObjectId: new mongoose.Types.ObjectId(teacherId),
    instituteObjectId: new mongoose.Types.ObjectId(instituteId),
  };
}

export async function GET(req) {
  try {
    const auth = getTeacherContext(req);
    if (auth.error) {
      return unauthorized(auth.error, auth.status);
    }

    await connectDB();

    const teacher = await Teacher.findOne({
      _id: auth.teacherObjectId,
      instituteId: auth.instituteObjectId,
      isActive: true,
    })
      .select("fullName email")
      .lean();

    if (!teacher) {
      return unauthorized("Teacher not found", 404);
    }

    const assignedClasses = await ClassModel.find({
      instituteId: auth.instituteObjectId,
      teacherId: auth.teacherObjectId,
      isActive: true,
    })
      .select("name year createdAt")
      .sort({ createdAt: 1 })
      .lean();

    if (!assignedClasses.length) {
      return NextResponse.json({
        success: true,
        data: {
          teacher,
          assignedClasses: [],
          currentClass: null,
          students: [],
          stats: {
            totalStudents: 0,
            feesPaid: 0,
            feesPartial: 0,
            feesUnpaid: 0,
          },
        },
      });
    }

    const classIds = assignedClasses.map((c) => c._id);
    const students = await Student.find({
      instituteId: auth.instituteObjectId,
      classId: { $in: classIds },
      isActive: true,
    })
      .select("fullName rollNumber feesStatus pendingFees classId")
      .sort({ fullName: 1 })
      .lean();

    const studentCountMap = new Map();
    for (const student of students) {
      const key = String(student.classId);
      studentCountMap.set(key, (studentCountMap.get(key) || 0) + 1);
    }

    const classesWithCounts = assignedClasses.map((cls) => ({
      _id: cls._id,
      name: cls.name,
      year: cls.year,
      studentCount: studentCountMap.get(String(cls._id)) || 0,
    }));

    const currentClass = [...classesWithCounts].sort((a, b) => b.studentCount - a.studentCount)[0] || null;
    const currentClassStudents = currentClass
      ? students.filter((s) => String(s.classId) === String(currentClass._id))
      : [];

    const feesPaid = currentClassStudents.filter((s) => s.feesStatus === "paid").length;
    const feesPartial = currentClassStudents.filter((s) => s.feesStatus === "partial").length;
    const feesUnpaid = currentClassStudents.filter((s) => s.feesStatus === "unpaid").length;

    return NextResponse.json({
      success: true,
      data: {
        teacher,
        assignedClasses: classesWithCounts,
        currentClass,
        students: currentClassStudents,
        stats: {
          totalStudents: currentClassStudents.length,
          feesPaid,
          feesPartial,
          feesUnpaid,
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to load teacher dashboard",
        ...(process.env.NODE_ENV !== "production" && { error: error?.message }),
      },
      { status: 500 }
    );
  }
}

