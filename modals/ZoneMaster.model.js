import mongoose from "mongoose";

const ZoneMasterSchema = new mongoose.Schema(
  {
    CreatedBy: { type: String, required: true, trim: true },
    UpdatedBy: { type: String, required: true, trim: true },
    ZoneAbbrevation: { type: String, required: true, trim: true },
    ZoneID: { type: Number, required: true }, 
    ZoneName: { type: String, required: true, trim: true },
  },
  { timestamps: true, collection: "ZoneMaster" }
);

const ZoneMaster = mongoose.model("ZoneMaster", ZoneMasterSchema);

export default ZoneMaster;
