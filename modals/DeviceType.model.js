import mongoose from "mongoose";


export const DeviceTypeSchema = new mongoose.Schema({
    "Id": Number,
    "dtype": String,
}, { collection: "DeviceType" })

export const DeviceType = mongoose.model("DeviceType", DeviceTypeSchema);