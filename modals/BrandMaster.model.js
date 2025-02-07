import mongoose from "mongoose";

const BrandMasterSchema = new mongoose.Schema({
    brandId: {
        type: Number,
        unique: true,
        required: true
    },
    brandshortname: {
        type: String,
        uppercase: true,
        trim: true
    },
    brandname: {
        type: String,
        uppercase: true,
        trim: true
    },
    brandCode: {
        type: String,
        uppercase: true,
        trim: true
    },
    createdBy: {
        type: String,
        trim: true
    },
    updatedBy: {
        type: String,
        trim: true
    },

}, {timestamps: true, collection: "brandMaster"})

const BrandMaster = mongoose.model("brandMaster", BrandMasterSchema);

export default BrandMaster;