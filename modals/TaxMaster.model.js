import mongoose from "mongoose";

export const TaxMasterSchema = new mongoose.Schema({
    "TaxId": Number,
    "TaxName": String,
    "TaxPercentage": Number,
    "EffectiveDate": Date,
    "CreatedBy": String,
    "UpdatedBy": String,
   
}, { timestamps:true, collection: "TaxMaster"})

export const TaxMaster = mongoose.model("TaxMaster", TaxMasterSchema);