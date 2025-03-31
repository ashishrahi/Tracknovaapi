import mongoose from "mongoose";

export const UnitMasterSchema = new mongoose.Schema(
  {
    UnitId: {
      type: Number,
      required: true,
      unique: true,
    },
    UnitName: {
      type: String,
      required: true,
      uppercase: true,
      trim: true
    },
    UnitShortname: {
      type: String,
      required: true,
      trim: true
    },
    CreatedBy: {
      type: String,
      // required: true,
      trim: true
    },
    UpdatedBy: {
      type: String,
    },
  },
  { timestamps: true, collection:  "UnitMaster"}
);

const UnitMaster = mongoose.model("UnitMaster", UnitMasterSchema);

export default UnitMaster;