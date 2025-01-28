import mongoose from "mongoose";

export const DepartmentSchema = new mongoose.Schema({
    "DepartmentId":Number,
    "DepartmentName": String,
    "DepartmentShortname": String,
    "CreatedBy": String,
    "UpdatedBy": String,
    "CreatedOn": Date,
    "UpdatedOn": Date,
    "HOD": Number,
}, { collection: "Department" })

export const Department = mongoose.model("Department", DepartmentSchema);