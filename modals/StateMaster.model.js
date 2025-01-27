import mongoose from "mongoose";


export const StateMasterSchema = new mongoose.Schema({
    "StateId":Number,
    "StateName": String,
    "StateCode": String,
    "CountryId": String,
    "CreatedBy": String,
    "UpdatedBy": String,
    
}, {timestamps:true, collection: "StateMaster" })

export const StateMaster = mongoose.model("StateMaster",StateMasterSchema);