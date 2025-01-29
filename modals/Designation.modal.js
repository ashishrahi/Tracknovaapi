import mongoose from "mongoose";


export const DesignationSchema = new mongoose.Schema({
    "DesignationId": Number,
    "DesignationName": String,
    "DesignationCode": String,
    "CreatedBy": String,
    "UpdatedBy": String,
    "CreatedOn": Date,
    "UpdatedOn": Date,
}, { collection: "Designation" })

export const Designation = mongoose.model("Designation", DesignationSchema);