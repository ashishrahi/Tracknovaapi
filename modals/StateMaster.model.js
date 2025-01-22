import mongoose from "mongoose";


export const StateMasterSchema = new mongoose.Schema({
    "StateId": {Type:Number},
    "StateName": {Type:String},
    "StateCode": {Type:String},
    "CountryId": {Type:Number},
    "CreatedBy": {Type:String},
    "UpdatedBy": {Type:String},
    "CreatedOn": {Type:Date},
    "UpdatedOn": {Type:Date},
}, { collection: "StateMaster" })

export const StateMaster = mongoose.model("StateMaster",StateMasterSchema);