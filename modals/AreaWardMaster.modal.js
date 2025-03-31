import mongoose, { Schema, model } from "mongoose";

export const AreaWardMasterSchema = new Schema(
  {
    AreaID: { type: Number, required: true, index: true },
    AreaName: { type: String, required: true, trim: true },
    CreatedBy: { type: String,  trim: true },
    BinLocName: { type: String, trim: true },
    UpdatedBy: { type: String, trim: true },
    WardNumber: { type: String, trim: true },
    ZoneID: { type: Number, index: true },
  },
  { timestamps: true, collection: "AreaWardMaster" }
);

export const AreaWardMaster = model("AreaWardMaster", AreaWardMasterSchema);
