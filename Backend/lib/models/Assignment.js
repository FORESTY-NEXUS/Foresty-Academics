import mongoose from "mongoose";

const AttachmentSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, trim: true },
    name: { type: String, default: "", trim: true },
    type: { type: String, default: "", trim: true },
  },
  { _id: false }
);

const AssignmentSchema = new mongoose.Schema(
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
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    note: {
      type: String,
      default: "",
      trim: true,
    },
    dueAt: {
      type: Date,
      default: null,
    },
    attachments: {
      type: [AttachmentSchema],
      default: [],
    },
  },
  { timestamps: true }
);

AssignmentSchema.index({ classId: 1, createdAt: -1 });

export default mongoose.models.Assignment || mongoose.model("Assignment", AssignmentSchema);
