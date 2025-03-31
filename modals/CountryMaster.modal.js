import mongoose, { Schema, model } from "mongoose";

export const CountryMasterSchema = new Schema(
  {
    CountryId: { type: Number, required: true, unique: true, index: true },
    CountryName: { type: String, required: true, trim: true },
    CountryCode: { type: String, required: true, trim: true, unique: true },
    CreatedBy: { type: String, trim: true },
    UpdatedBy: { type: String, trim: true },
  },
  { timestamps: true, collection: "CountryMaster" } 
);

export const CountryMaster = model("CountryMaster", CountryMasterSchema);
