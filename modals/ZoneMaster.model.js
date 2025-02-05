import mongoose from "mongoose";

const ZoneMasterSchema = new mongoose.Schema(
  {
    CreatedBy: { type: String,  trim: true },
    UpdatedBy: { type: String,  trim: true },
    ZoneAbbrevation: { type: String,  trim: true },
    ZoneID: { type: Number,  }, 
    ZoneName: { type: String,  trim: true },
  },
  { timestamps: true, collection: "ZoneMaster" }
);

const ZoneMaster = mongoose.model("ZoneMaster", ZoneMasterSchema);

export default ZoneMaster;
