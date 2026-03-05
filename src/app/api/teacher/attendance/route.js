import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "../../../../../Backend/lib/db";
import Student from "../../../../../Backend/lib/models/Student";
import Attendance from "../../../../../Backend/lib/models/Attendance";
import { getTeacherContext, getTeacherAndClasses } from "../_utils";

function errorJson(message, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

function pickCurrentClass(assignedClasses, requestedClassId) {
  if (!assignedClasses.length) return null;
  if (!requestedClassId) return assignedClasses[0];
  return assignedClasses.find((c) => String(c._id) === String(requestedClassId)) || null;
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
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
    const date = searchParams.get("date") || todayStr();
    const currentClass = pickCurrentClass(base.assignedClasses, requestedClassId);

    if (!currentClass) {
      return NextResponse.json({
        success: true,
        data: {
          assignedClasses: [],
          currentClass: null,
          date,
          students: [],
          records: [],
          summary: [],
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
    const todayRecords = await Attendance.find({
      instituteId: auth.instituteObjectId,
      classId: currentClass._id,
      studentId: { $in: studentIds },
      date,
    })
      .select("studentId status date")
      .lean();

    const allRecords = await Attendance.find({
      instituteId: auth.instituteObjectId,
      classId: currentClass._id,
      studentId: { $in: studentIds },
    })
      .select("studentId status")
      .lean();

    const monthKey = date.slice(0, 7);
    const monthRecords = await Attendance.find({
      instituteId: auth.instituteObjectId,
      classId: currentClass._id,
      studentId: { $in: studentIds },
      date: { $regex: `^${monthKey}` },
    })
      .select("studentId status")
      .lean();

    const summaryByStudent = new Map();
    const monthSummaryByStudent = new Map();
    for (const student of students) {
      summaryByStudent.set(String(student._id), { total: 0, present: 0 });
      monthSummaryByStudent.set(String(student._id), { total: 0, present: 0 });
    }
    for (const record of allRecords) {
      const key = String(record.studentId);
      const row = summaryByStudent.get(key);
      if (!row) continue;
      row.total += 1;
      if (record.status === "Present") row.present += 1;
    }
    for (const record of monthRecords) {
      const key = String(record.studentId);
      const row = monthSummaryByStudent.get(key);
      if (!row) continue;
      row.total += 1;
      if (record.status === "Present") row.present += 1;
    }

    const summary = students.map((student) => {
      const row = summaryByStudent.get(String(student._id)) || { total: 0, present: 0 };
      const pct = row.total ? Math.round((row.present / row.total) * 100) : 0;
      return {
        studentId: student._id,
        fullName: student.fullName,
        rollNumber: student.rollNumber,
        percentage: pct,
        totalDays: row.total,
      };
    });
    const monthSummary = students.map((student) => {
      const row = monthSummaryByStudent.get(String(student._id)) || { total: 0, present: 0 };
      const pct = row.total ? Math.round((row.present / row.total) * 100) : 0;
      return {
        studentId: student._id,
        fullName: student.fullName,
        rollNumber: student.rollNumber,
        percentage: pct,
        totalDays: row.total,
        presentDays: row.present,
      };
    });

    const presentToday = todayRecords
      .filter((r) => r.status === "Present")
      .map((r) => {
        const student = students.find((s) => String(s._id) === String(r.studentId));
        return student
          ? { studentId: student._id, fullName: student.fullName, rollNumber: student.rollNumber }
          : null;
      })
      .filter(Boolean);

    return NextResponse.json({
      success: true,
      data: {
        assignedClasses: base.assignedClasses,
        currentClass,
        date,
        monthKey,
        students,
        records: todayRecords,
        presentToday,
        summary,
        monthSummary,
      },
    });
  } catch (error) {
    return errorJson(error?.message || "Failed to fetch attendance", 500);
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
    const date = body?.date?.toString?.().trim();
    const records = Array.isArray(body?.records) ? body.records : [];

    if (!classId || !mongoose.Types.ObjectId.isValid(classId)) return errorJson("Invalid class id", 400);
    if (!date) return errorJson("Date is required", 400);

    const currentClass = base.assignedClasses.find((c) => String(c._id) === classId);
    if (!currentClass) return errorJson("Class not found in your account", 404);

    const students = await Student.find({
      instituteId: auth.instituteObjectId,
      classId: currentClass._id,
      isActive: true,
    })
      .select("_id")
      .lean();
    const allowedStudentIds = new Set(students.map((s) => String(s._id)));

    await Attendance.deleteMany({
      instituteId: auth.instituteObjectId,
      classId: currentClass._id,
      date,
      studentId: { $in: [...allowedStudentIds].map((id) => new mongoose.Types.ObjectId(id)) },
    });

    const docs = records
      .filter((r) => allowedStudentIds.has(String(r.studentId)))
      .map((r) => ({
        instituteId: auth.instituteObjectId,
        classId: currentClass._id,
        teacherId: auth.teacherObjectId,
        studentId: new mongoose.Types.ObjectId(r.studentId),
        date,
        status: r.status === "Absent" ? "Absent" : "Present",
      }));

    if (docs.length) {
      await Attendance.insertMany(docs);
    }

    return NextResponse.json({ success: true, message: "Attendance saved" });
  } catch (error) {
    return errorJson(error?.message || "Failed to save attendance", 500);
  }
}
