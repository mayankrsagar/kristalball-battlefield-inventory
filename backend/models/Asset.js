import mongoose from "mongoose";

const assetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g., "Rifle M16"
    type: {
      type: String,
      enum: ["Weapon", "Vehicle", "Ammunition"],
      required: true,
    },
    baseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Base",
      required: true,
    },
    quantity: { type: Number, min: 0, required: true },
  },
  { timestamps: true }
);

const Asset = mongoose.models.Asset || mongoose.model("Asset", assetSchema);
export default Asset;
