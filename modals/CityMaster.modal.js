import mongoose, { Schema, model } from "mongoose";

export const CityMasterSchema = new Schema(
  {
    CityId: { type: Number, required: true, unique: true, index: true },
    CityName: { type: String, required: true, trim: true },
    StateId: { type: Number, required: true, index: true },
    CreatedBy: { type: String, trim: true },
    UpdatedBy: { type: String, trim: true },
  },
  { timestamps: true, collection: "CityMaster" }
);

export const CityMaster = model("CityMaster", CityMasterSchema);
