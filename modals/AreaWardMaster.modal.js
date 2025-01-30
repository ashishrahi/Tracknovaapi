import mongoose from "mongoose";

const AreaWardMasterSchema = new mongoose.Schema(
  {
    AreaID: { type: Number, required: true },
    AreaName: { type: String },
    CreatedBy: { type: String },
    BinLocName: { type: String },
    UpdatedBy: { type: String },
    WardNumber: String,
    ZoneID: Number,
  },
  { timestamps: true, collection: "AreaWardMaster" }
);

export const AreaWardMaster = mongoose.model("AreaWardMaster",AreaWardMasterSchema);
