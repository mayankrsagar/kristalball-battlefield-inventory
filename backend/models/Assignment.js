import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    assetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset",
      required: true,
    },
    baseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Base",
      required: true,
    },
    quantity: { type: Number, min: 1, required: true },
    assignedTo: { type: String, required: true },
    assignmentDate: { type: Date, required: true },
  },
  { timestamps: true }
);

const Assignment =
  mongoose.models.Assignment || mongoose.model("Assignment", assignmentSchema);
export default Assignment;
