import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema(
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
    purchaseDate: { type: Date, required: true },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Purchase =
  mongoose.models.Purchase || mongoose.model("Purchase", purchaseSchema);
export default Purchase;
