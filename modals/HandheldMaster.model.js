import mongoose from "mongoose";
export const HandheldMasterSchema = new mongoose.Schema({
    "ID": Number,
    "HandheldName": String,
    "HandheldCode": String,
    "CreatedBy": String,
    "UpdatedBy": String,
    "CreatedOn": Date,
    "UpdatedOn": Date,
}, { collection: "HandheldMaster" })

export const HandheldMaster = mongoose.model("HandheldMaster", HandheldMasterSchema);