import mongoose from "mongoose";

export const RouteAreaDetailSchema = new mongoose.Schema({
    "RouteDetailId":Number,
    "RouteID": Number,
    "AreaID": Number,
    "CreatedBy": String,
    "UpdatedBy": String,
    "CreatedOn": Date,
    "UpdatedOn": Date,
}, { collection: "RouteAreaDetail" })

export const RouteAreaDetail = mongoose.model("RouteAreaDetail", RouteAreaDetailSchema);