import mongoose from "mongoose";

const MarkSchema = new mongoose.Schema(
  {
    instituteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
      required: true,
      index: true,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
      index: true,
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
      index: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    total: {
      type: Number,
      min: 1,
      required: true,
    },
    obtained: {
      type: Number,
      min: 0,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Mark || mongoose.model("Mark", MarkSchema);

