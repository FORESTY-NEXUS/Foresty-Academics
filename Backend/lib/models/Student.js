import mongoose from "mongoose";

const ROLL_REGEX = /^\d{4}$/;

const StudentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    rollNumber: {
      type: String,
      required: true,
      trim: true,
      match: ROLL_REGEX,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    fatherName: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    profilePhoto: {
      type: String,
      default: "",
      trim: true,
    },
    feesStatus: {
      type: String,
      enum: ["paid", "unpaid", "partial"],
      default: "unpaid",
    },
    pendingFees: {
      type: Number,
      min: 0,
      default: 0,
      required: function requiredPendingFees() {
        return this.feesStatus === "unpaid";
      },
    },
    instituteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
      required: true,
      index: true,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      default: null,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ["student"],
      default: "student",
    },
  },
  { timestamps: true }
);

StudentSchema.index({ rollNumber: 1, instituteId: 1 }, { unique: true });

export default mongoose.models.Student || mongoose.model("Student", StudentSchema);
