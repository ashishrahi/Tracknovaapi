import mongoose from "mongoose";

const ZoneMasterSchema = new mongoose.Schema({
    CreatedBy: String,
    UpdatedBy: String,
    ZoneAbbrevation: String,
    ZoneID: mongoose.Schema.Types.Int32,
    ZoneName: String
})

const ZoneMaster = mongoose.model("ZoneMaster", ZoneMasterSchema)

export default ZoneMaster;