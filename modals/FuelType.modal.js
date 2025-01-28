import mongoose from "mongoose";

export const FuelTypeSchema = new mongoose.Schema({
    "FuelTypeId": Number,
    "ShortName": String,
    "FuelTypename": String,
    "FuelCode": String,
    "CreatedBy": String,
    "UpdatedBy": String,
}, {timestamps:true, collection: "FuelType" })

export const FuelType = mongoose.model("FuelType", FuelTypeSchema);