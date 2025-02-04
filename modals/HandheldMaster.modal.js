import mongoose, { Schema, model } from "mongoose";

const HandheldMasterSchema = new Schema(
  {
    ID: { type: Number, required: true, unique: true, index: true },
    HandheldName: { type: String, required: true, trim: true },
    HandheldCode: { type: String, required: true, trim: true },
    CreatedBy: { type: String, trim: true },
    UpdatedBy: { type: String, trim: true },
  },
  { timestamps: true, collection: "HandheldMaster" } // Automatically handles CreatedOn & UpdatedOn
);

export const HandheldMaster = model("HandheldMaster", HandheldMasterSchema);
