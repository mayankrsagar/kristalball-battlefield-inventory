import mongoose from "mongoose";

const transferSchema = new mongoose.Schema(
  {
    assetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset",
      required: true,
    },
    fromBaseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Base",
      required: true,
    },
    toBaseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Base",
      required: true,
    },
    quantity: { type: Number, min: 1, required: true },
    transferDate: { type: Date, required: true },
    initiatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Transfer =
  mongoose.models.Transfer || mongoose.model("Transfer", transferSchema);
export default Transfer;
