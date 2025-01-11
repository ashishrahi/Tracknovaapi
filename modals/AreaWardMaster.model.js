import mongoose from "mongoose";

const AreaWardMasterSchema = new mongoose.Schema({

    AreaID: Number,
    AreaName: String,
    CreatedBy: String,
    BinLocName: String,
    CreatedBy: String,
    CreatedOn: Date,
    UpdatedBy: String,
    UpdatedOn: mongoose.Schema.Types.Date,
    WardNumber: String,
    ZoneID: mongoose.Schema.Types.Decimal128,

}, {timestamps: true, collection: "AreaWardMaster"})

export const AreaWardMaster = mongoose.model("AreaWardMaster", AreaWardMasterSchema)