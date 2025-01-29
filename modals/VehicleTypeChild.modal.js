import mongoose from "mongoose";

export const VehicleTypeChildSchema = new mongoose.Schema({
    "id": Number,
    "VehicleTypeId": Number,
    "SessionD1": Number,
    "SessionD2": Number,
    "PetroId": Number,
    "PetroName": String,
    "EffectiveDate": Date,
    "CreatedBy": String,
    "UpdatedBy": String,
    "FuelAlloted": Number,
}, {timestamps:true, collection: "VehicleTypeChild" })

export const VehicleTypeChild = mongoose.model("VehicleTypeChild", VehicleTypeChildSchema);