import mongoose from "mongoose";


export const VehicleTypeMasterSchema = new mongoose.Schema({
    "VehicleTypeId": Number,
    "ShortName": String,
    "VehicleTypename": String,
    "VehicleCode": String,
    "CreatedBy": String,
    "UpdatedBy": String,
    
}, {timestamps:true, collection: "VehicleTypeMaster" })

export const VehicleTypeMaster = mongoose.model("VehicleTypeMaster", VehicleTypeMasterSchema);