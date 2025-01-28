import mongoose from "mongoose";

export const ZoneMasterSchema = new mongoose.Schema({
    "ZoneID": Number,
    "ZoneName": String,
    "ZoneAbbrevation": String,
    "CreatedBy": String,
    "UpdatedBy": String,
    "CreatedOn": Date,
    "UpdatedOn": Date,
}, { collection: "ZoneMaster" })

export const ZoneMaster = mongoose.model("ZoneMaster", ZoneMasterSchema);