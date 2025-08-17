import mongoose from "mongoose";

const expenditureSchema = new mongoose.Schema(
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
    reason: {
      type: String,
      enum: ["Used", "Damaged", "Expired"],
      required: true,
    },
    dateExpended: { type: Date, required: true },
  },
  { timestamps: true }
);

const Expenditure =
  mongoose.models.Expenditure ||
  mongoose.model("Expenditure", expenditureSchema);
export default Expenditure;
