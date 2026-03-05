import { NextResponse } from "next/server";
import { connectDB } from "../../../../../Backend/lib/db";
import Student from "../../../../../Backend/lib/models/Student";
import Teacher from "../../../../../Backend/lib/models/Teacher";

export async function GET() {
  try {
    await connectDB();

    const students = await Student.find({ isActive: true }).lean();
    const teachers = await Teacher.find({ isActive: true }).lean();

    // Calculate fee statistics
    const totalPending = students.reduce((sum, student) => {
      return sum + (student.pendingFees || 0);
    }, 0);

    const totalPaid = students.reduce((sum, student) => {
      return sum + (student.feesStatus === "paid" ? (student.pendingFees || 0) : 0);
    }, 0);

    const paidStudents = students.filter((s) => s.feesStatus === "paid").length;
    const unpaidStudents = students.filter((s) => s.feesStatus === "unpaid").length;
    const partialStudents = students.filter((s) => s.feesStatus === "partial").length;

    return NextResponse.json({
      success: true,
      data: {
        totalStudents: students.length,
        totalTeachers: teachers.length,
        totalPending,
        totalPaid,
        paidStudents,
        unpaidStudents,
        partialStudents,
        students,
        teachers,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
