import mongoose from "mongoose";

export const CityMasterSchema = new mongoose.Schema({
    "CityId": {Type:Number},
    "CityName": {Type:String},
    "StateId": {Type:Number},
    "CreatedBy": {Type:String},
    "UpdatedBy": {Type:String},
    
}, {timestamps:true, collection: "CityMaster" })

export const CityMaster = mongoose.model("CityMaster", CityMasterSchema);