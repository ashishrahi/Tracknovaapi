import mongoose from "mongoose";


export const GeofencingSchema = new mongoose.Schema({
    "FenceId": Number,
    "Lattitude": Number,
    "Longitude": Number,
    "Radius": Number,
    "FenceName": String,
    "DateSave": Date,
    "CompanyId": Number,
    "flag": Boolean,
    "AreaId": Number,
    "polycord": String,
}, { collection: "Geofencing" })

export const Geofencing = mongoose.model("Geofencing", GeofencingSchema);