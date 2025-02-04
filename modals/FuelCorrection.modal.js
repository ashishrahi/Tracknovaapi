import mongoose, { Schema, model } from "mongoose";

const FuelCorrectionSchema = new Schema(
  {
    CorrId: { type: Number, required: true, unique: true, index: true },
    CorrectionDate: { type: Date, required: true },
    ItemMasterId: { type: Number, required: true, index: true },
    SelectedOB: { type: Number, required: true },
    CorrectedOB: { type: Number, required: true },
    CreatedBy: { type: String, trim: true },
    UpdatedBy: { type: String, trim: true },
  },
  { timestamps: true, collection: "FuelCorrection" } // Automatically handles CreatedOn & UpdatedOn
);

export const FuelCorrection = model("FuelCorrection", FuelCorrectionSchema);
