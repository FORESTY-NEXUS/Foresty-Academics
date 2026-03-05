import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { connectDB } from "../../../../../Backend/lib/db";
import ClassModel from "../../../../../Backend/lib/models/Class";
import Student from "../../../../../Backend/lib/models/Student";
import Teacher from "../../../../../Backend/lib/models/Teacher";

function getAdminContext(req) {
  if (!process.env.JWT_SECRET) {
    return { error: "JWT secret is not configured", status: 500 };
  }

  const token = req.cookies.get("adminToken")?.value;
  if (!token) {
    return { error: "Unauthorized", status: 401 };
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });
  } catch {
    return { error: "Invalid or expired token", status: 401 };
  }

  if (!payload?.id || payload.role !== "admin") {
    return { error: "Forbidden", status: 403 };
  }

  const adminId = typeof payload.id === "string" ? payload.id : payload.id?.toString?.();
  const instituteId =
    typeof payload.instituteId === "string"
      ? payload.instituteId
      : payload.instituteId?.toString?.();

  if (!adminId || !instituteId) {
    return { error: "Invalid admin token context", status: 401 };
  }

  if (!mongoose.Types.ObjectId.isValid(adminId) || !mongoose.Types.ObjectId.isValid(instituteId)) {
    return { error: "Invalid admin token context", status: 401 };
  }

  return {
    adminId,
    instituteId,
    adminObjectId: new mongoose.Types.ObjectId(adminId),
    instituteObjectId: new mongoose.Types.ObjectId(instituteId),
  };
}

export async function GET(req) {
  try {
    const auth = getAdminContext(req);
    if (auth.error) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    await connectDB();

    const classes = await ClassModel.find({
      isActive: true,
      instituteId: auth.instituteObjectId,
    })
      .populate({ path: "teacherId", select: "fullName email isActive" })
      .sort({ createdAt: -1 })
      .lean();

    const studentCounts = await Student.collection
      .aggregate([
        {
          $match: {
            isActive: true,
            instituteId: auth.instituteObjectId,
            classId: { $exists: true, $ne: null },
          },
        },
        {
          $group: {
            _id: { $toString: "$classId" },
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();

    const studentCountMap = studentCounts.reduce((acc, row) => {
      acc[row._id] = row.count;
      return acc;
    }, {});

    const data = classes.map((cls) => ({
      _id: cls._id,
      name: cls.name,
      year: cls.year,
      isActive: cls.isActive,
      createdAt: cls.createdAt,
      teacherId: cls.teacherId?._id || null,
      teacherName: cls.teacherId?.fullName || null,
      teacherEmail: cls.teacherId?.email || null,
      studentCount: studentCountMap[String(cls._id)] || 0,
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch classes" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const auth = getAdminContext(req);
    if (auth.error) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const body = await req.json();
    const name = body?.name?.trim();
    const year = body?.year?.toString()?.trim() || "2025";
    const teacherIdRaw = body?.teacherId;
    const teacherId = typeof teacherIdRaw === "string" && teacherIdRaw.trim() ? teacherIdRaw.trim() : null;

    if (!name) {
      return NextResponse.json({ success: false, error: "Class name is required" }, { status: 400 });
    }

    await connectDB();

    let teacher = null;
    if (teacherId) {
      if (!mongoose.Types.ObjectId.isValid(teacherId)) {
        return NextResponse.json({ success: false, error: "Invalid teacher id" }, { status: 400 });
      }

      teacher = await Teacher.findOne({
        _id: new mongoose.Types.ObjectId(teacherId),
        instituteId: auth.instituteObjectId,
        isActive: true,
      }).lean();

      if (!teacher) {
        return NextResponse.json(
          { success: false, error: "Teacher not found in your institute" },
          { status: 404 }
        );
      }
    }

    const created = await ClassModel.create({
      name,
      year,
      instituteId: auth.instituteObjectId,
      teacherId: teacher ? teacher._id : null,
      isActive: true,
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          _id: created._id,
          name: created.name,
          year: created.year,
          isActive: created.isActive,
          createdAt: created.createdAt,
          teacherId: teacher ? teacher._id : null,
          teacherName: teacher ? teacher.fullName : null,
          teacherEmail: teacher ? teacher.email : null,
          studentCount: 0,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create class" },
      { status: 500 }
    );
  }
}
