import mongoose from "mongoose";

export const UnitMasterSchema = new mongoose.Schema({
    "UnitId": Number,
    "UnitName": String,
    "UnitShortname": String,
    "CreatedBy": String,
    "UpdatedBy": String,
    
}, {timestamps:true, collection: "UnitMaster" })

export const UnitMaster = mongoose.model("UnitMaster", UnitMasterSchema);