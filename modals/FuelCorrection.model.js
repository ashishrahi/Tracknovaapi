import mongoose from "mongoose";

export const FuelCorrectionSchema = new mongoose.Schema({
    "CorrId": {Type:Number},
    "CorrectionDate": Date,
    "ItemMasterId": Number,
    "SelectedOB": Number,
    "CorrectedOB": Number,
    "CreatedBy": String,
    "UpdatedBy": String,
    "CreatedOn": Date,
    "UpdatedOn": Date,
}, { collection: "FuelCorrection" })

export const FuelCorrection = mongoose.model("FuelCorrection", FuelCorrectionSchema);