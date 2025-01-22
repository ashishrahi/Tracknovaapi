import mongoose from "mongoose";

const brandMasterSchema = new mongoose.Schema({

    brandCode: String,
    brandId: mongoose.Schema.Types.Int32,
    brandname: String,
    brandshortname: String,
    CreatedBy: String,
    CreatedOn: Date,
    UpdatedBy: String,
    UpdatedOn: Date,
}, {timestamps: true, collection: "brandMaster"})

export const brandMaster = mongoose.model("brandMaster", brandMasterSchema)