import mongoose from "mongoose";

const AreaWardMasterSchema = new mongoose.Schema(
  {
    AreaID: { type: Number, required: true },
    AreaName: { type: String },
    CreatedBy: { type: String },
    BinLocName: { type: String },
    CreatedBy: { type: String },
    CreatedOn: { type: Date },
    UpdatedBy: { type: String },
    UpdatedOn: mongoose.Schema.Types.Date,
    WardNumber: String,
    ZoneID: mongoose.Schema.Types.Decimal128,
  },
  { timestamps: true, collection: "AreaWardMaster" }
);

export const AreaWardMaster = mongoose.model(
  "AreaWardMaster",
  AreaWardMasterSchema
);
