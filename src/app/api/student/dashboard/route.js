import { NextResponse } from "next/server";
import { connectDB } from "../../../../../Backend/lib/db";
import Student from "../../../../../Backend/lib/models/Student";
import ClassModel from "../../../../../Backend/lib/models/Class";
import Teacher from "../../../../../Backend/lib/models/Teacher";
import Mark from "../../../../../Backend/lib/models/Mark";
import Attendance from "../../../../../Backend/lib/models/Attendance";
import { uploadImageToCloudinary } from "../../../../../Backend/lib/utils/cloudinary";
import { getStudentContext } from "../_utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function errorJson(message, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

function normalizeFeeStatus(status) {
  if (status === "paid") return "Paid";
  if (status === "partial") return "Partial";
  return "Unpaid";
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
      .select("fullName rollNumber fatherName address phoneNumber feesStatus pendingFees classId profilePhoto")
      .lean();

    if (!student) return errorJson("Student not found", 404);

    let cls = null;
    let teacher = null;

    if (student.classId) {
      cls = await ClassModel.findOne({
        _id: student.classId,
        instituteId: auth.instituteObjectId,
        isActive: true,
      })
        .select("name year teacherId")
        .lean();

      if (cls?.teacherId) {
        teacher = await Teacher.findOne({
          _id: cls.teacherId,
          instituteId: auth.instituteObjectId,
          isActive: true,
        })
          .select("fullName email")
          .lean();
      }
    }

    const markFilter = {
      instituteId: auth.instituteObjectId,
      studentId: auth.studentObjectId,
    };
    if (student.classId) markFilter.classId = student.classId;

    const attendanceFilter = {
      instituteId: auth.instituteObjectId,
      studentId: auth.studentObjectId,
    };
    if (student.classId) attendanceFilter.classId = student.classId;

    const [marks, attendance] = await Promise.all([
      Mark.find(markFilter).select("subject total obtained updatedAt").sort({ createdAt: -1 }).lean(),
      Attendance.find(attendanceFilter).select("date status").sort({ date: -1 }).lean(),
    ]);

    const normalizedMarks = marks.map((row) => ({
      id: String(row._id),
      subject: row.subject,
      total: row.total,
      obtained: row.obtained,
      updatedAt: row.updatedAt,
    }));

    const normalizedAttendance = attendance.map((row) => ({
      id: String(row._id),
      date: row.date,
      status: row.status,
    }));

    return NextResponse.json({
      success: true,
      data: {
        user: {
          name: student.fullName,
          role: "student",
        },
        student: {
          id: String(student._id),
          fullName: student.fullName,
          roll: student.rollNumber,
          fatherName: student.fatherName,
          address: student.address,
          contact: student.phoneNumber,
          profilePhoto: student.profilePhoto || "",
        },
        cls: cls
          ? {
              id: String(cls._id),
              name: cls.name,
              year: cls.year,
            }
          : null,
        teacher: teacher
          ? {
              id: String(teacher._id),
              name: teacher.fullName,
              email: teacher.email,
            }
          : null,
        marks: normalizedMarks,
        attendance: normalizedAttendance,
        fee: {
          status: normalizeFeeStatus(student.feesStatus),
          pending: Number(student.pendingFees || 0),
        },
      },
    });
  } catch (error) {
    return errorJson(error?.message || "Failed to load student dashboard", 500);
  }
}

export async function PATCH(req) {
  try {
    const auth = getStudentContext(req);
    if (auth.error) return errorJson(auth.error, auth.status);

    await connectDB();

    const formData = await req.formData();
    const maybeFile = formData.get("profilePhoto");
    if (!(maybeFile instanceof File) || maybeFile.size <= 0) {
      return errorJson("profilePhoto file is required", 400);
    }

    const profilePhoto = await uploadImageToCloudinary(maybeFile, {
      folder: `foresty-academics/students/${String(auth.instituteObjectId)}`,
    });

    const updated = await Student.findOneAndUpdate(
      {
        _id: auth.studentObjectId,
        instituteId: auth.instituteObjectId,
        isActive: true,
      },
      { $set: { profilePhoto } },
      { new: true }
    )
      .select("profilePhoto")
      .lean();

    if (!updated) return errorJson("Student not found", 404);

    return NextResponse.json({
      success: true,
      message: "Profile photo updated",
      data: { profilePhoto: updated.profilePhoto || "" },
    });
  } catch (error) {
    return errorJson(error?.message || "Failed to update profile photo", 500);
  }
}
