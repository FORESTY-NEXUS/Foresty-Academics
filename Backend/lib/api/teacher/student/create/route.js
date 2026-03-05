import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { connectDB } from "../../../../db";
import Student from "../../../../models/Student";
import ClassModel from "../../../../models/Class";
import { uploadImageToCloudinary } from "../../../../utils/cloudinary";

const ROLL_REGEX = /^\d{4}$/;
const PHONE_REGEX = /^\d{10,15}$/;
const SALT_ROUNDS = 12;

export async function POST(req) {
  try {
    if (!process.env.JWT_SECRET) {
      return NextResponse.json(
        { success: false, message: "JWT secret is not configured" },
        { status: 500 }
      );
    }

    const token = req.cookies.get("teacherToken")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    if (!payload?.id || payload.role !== "teacher") {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    const teacherId = typeof payload.id === "string" ? payload.id.trim() : "";
    const instituteId =
      typeof payload.instituteId === "string" ? payload.instituteId.trim() : "";

    if (!mongoose.Types.ObjectId.isValid(teacherId) || !mongoose.Types.ObjectId.isValid(instituteId)) {
      return NextResponse.json(
        { success: false, message: "Invalid teacher token context" },
        { status: 401 }
      );
    }

    const contentType = req.headers.get("content-type") || "";
    const isMultipart = contentType.includes("multipart/form-data");

    let body = {};
    let profilePhotoFile = null;

    if (isMultipart) {
      const formData = await req.formData();
      body = {
        fullName: formData.get("fullName"),
        rollNumber: formData.get("rollNumber"),
        password: formData.get("password"),
        fatherName: formData.get("fatherName"),
        address: formData.get("address"),
        phoneNumber: formData.get("phoneNumber"),
        feesStatus: formData.get("feesStatus"),
        classId: formData.get("classId"),
        pendingFees: formData.get("pendingFees"),
      };

      const maybeFile = formData.get("profilePhoto");
      if (maybeFile instanceof File && maybeFile.size > 0) {
        profilePhotoFile = maybeFile;
      }
    } else {
      body = await req.json();
    }

    const fullName = body?.fullName?.toString?.().trim();
    const rollNumber = body?.rollNumber?.toString?.().trim();
    const password = body?.password?.toString?.().trim();
    const fatherName = body?.fatherName?.toString?.().trim();
    const address = body?.address?.toString?.().trim();
    const phoneNumber = body?.phoneNumber?.toString?.().trim();
    const feesStatus = body?.feesStatus?.toString?.().trim()?.toLowerCase();
    const classIdRaw = body?.classId?.toString?.().trim();
    const pendingFeesInput = body?.pendingFees;

    if (!fullName || !rollNumber || !password || !fatherName || !address || !phoneNumber || !feesStatus) {
      return NextResponse.json(
        { success: false, message: "All required fields must be provided" },
        { status: 400 }
      );
    }

    if (!ROLL_REGEX.test(rollNumber)) {
      return NextResponse.json(
        { success: false, message: "rollNumber must be exactly 4 digits" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    if (!PHONE_REGEX.test(phoneNumber)) {
      return NextResponse.json(
        { success: false, message: "Invalid phoneNumber format" },
        { status: 400 }
      );
    }

    if (!["paid", "unpaid", "partial"].includes(feesStatus)) {
      return NextResponse.json(
        { success: false, message: "feesStatus must be paid, unpaid, or partial" },
        { status: 400 }
      );
    }

    let pendingFees = 0;
    if (feesStatus === "unpaid") {
      pendingFees = Number(pendingFeesInput);
      if (!Number.isFinite(pendingFees) || pendingFees <= 0) {
        return NextResponse.json(
          { success: false, message: "pendingFees is required and must be greater than 0 when feesStatus is unpaid" },
          { status: 400 }
        );
      }
    }

    await connectDB();

    let assignedClass = null;
    if (classIdRaw) {
      if (!mongoose.Types.ObjectId.isValid(classIdRaw)) {
        return NextResponse.json(
          { success: false, message: "Invalid class id" },
          { status: 400 }
        );
      }

      assignedClass = await ClassModel.findOne({
        _id: new mongoose.Types.ObjectId(classIdRaw),
        instituteId: new mongoose.Types.ObjectId(instituteId),
        teacherId: new mongoose.Types.ObjectId(teacherId),
        isActive: true,
      }).lean();
    } else {
      assignedClass = await ClassModel.findOne({
        instituteId: new mongoose.Types.ObjectId(instituteId),
        teacherId: new mongoose.Types.ObjectId(teacherId),
        isActive: true,
      })
        .sort({ createdAt: 1 })
        .lean();
    }

    if (!assignedClass) {
      return NextResponse.json(
        { success: false, message: "No class assigned to this teacher" },
        { status: 400 }
      );
    }

    const existing = await Student.findOne({
      rollNumber,
      instituteId: new mongoose.Types.ObjectId(instituteId),
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: "Roll number already exists in this institute" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const profilePhoto = profilePhotoFile
      ? await uploadImageToCloudinary(profilePhotoFile, {
          folder: `foresty-academics/students/${instituteId}`,
        })
      : "";

    await Student.create({
      fullName,
      rollNumber,
      password: hashedPassword,
      fatherName,
      address,
      phoneNumber,
      feesStatus,
      pendingFees,
      profilePhoto,
      instituteId: new mongoose.Types.ObjectId(instituteId),
      classId: assignedClass._id,
      createdBy: new mongoose.Types.ObjectId(teacherId),
    });

    return NextResponse.json(
      { success: true, message: "Student created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create student error:", error);

    if (error?.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Roll number already exists in this institute" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Server error",
        ...(process.env.NODE_ENV !== "production" && { error: error?.message }),
      },
      { status: 500 }
    );
  }
}
