import mongoose from "mongoose";

export const RosterPlanSchema = new mongoose.Schema({
    "RosterID": Number,
    "RosterNo": String,
    "RosterDate": Date,
    "FromDate": Date,
    "Todate": Date,
    "CreatedBy": String,
    "UpdatedBy": String,
    "CreatedOn": Date,
    "UpdatedOn": Date,
}, { collection: "RosterPlan" })

export const RosterPlan = mongoose.model("RosterPlan", RosterPlanSchema);