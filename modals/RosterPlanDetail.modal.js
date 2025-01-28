import mongoose from "mongoose";

export const RosterPlanDetailSchema = new mongoose.Schema({
    "RosterDetailID": Number,
    "RosterID": Number,
    "EmpId": Number,
    "VehicleID": Number,
    "HandheldID": Number,
    "RouteID": Number,
    "CreatedBy": String,
    "UpdatedBy": String,
    "CreatedOn": Date,
    "UpdatedOn": Date,
}, { timestamps:true , collection:"RosterPlanDetail"})

export const RosterPlanDetail = mongoose.model("RosterPlanDetail", RosterPlanDetailSchema);