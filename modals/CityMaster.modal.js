import mongoose from "mongoose";

export const CityMasterSchema = new mongoose.Schema({
    "CityId": Number,
    "CityName": String,
    "StateId": Number,
    "CreatedBy": String,
    "UpdatedBy": String,
    
}, {timestamps:true, collection: "CityMaster" })

export const CityMaster = mongoose.model("CityMaster", CityMasterSchema);