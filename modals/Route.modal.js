import mongoose from "mongoose";

const RouteSchema = new mongoose.Schema({
   " CreatedBy" : String,
    "CreatedOn": Date,
    "Description": String,
    "RouteDate": Date,
    "RouteID": Number,
    "RouteName":String,
    "UpdatedBy":String,
    "UpdatedOn":Date,
}, {timestamps: true, collection: "Route"})

export const Route = mongoose.model("Route", RouteSchema)