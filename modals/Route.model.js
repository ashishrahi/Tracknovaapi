import mongoose from "mongoose";

const RouteSchema = new mongoose.Schema({
    CreatedBy : String,
    CreatedOn: Date,
    Description: String,
    RouteDate: Date,
    RouteID: mongoose.Schema.Types.Int32,
    RouteName:String,
    UpdatedBy:String,
    UpdatedOn:Date,
}, {timestamps: true, collection: "Route"})

export const Route = mongoose.model("Route", RouteSchema)