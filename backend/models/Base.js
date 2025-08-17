import mongoose from "mongoose";

const baseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
  },
  { timestamps: true }
);

const Base = mongoose.models.Base || mongoose.model("Base", baseSchema);
export default Base;
