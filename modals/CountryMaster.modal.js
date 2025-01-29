import mongoose from "mongoose";

export const CountryMasterSchema = new mongoose.Schema({
    "CountryId":Number,
    "CountryName": String,
    "CountryCode": String,
    "CreatedBy": String,
    "UpdatedBy": String,
    "CreatedOn": Date,
    "UpdatedOn": Date,
}, { collection: "CountryMaster" })

export const CountryMaster = mongoose.model("CountryMaster", CountryMasterSchema);