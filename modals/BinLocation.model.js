import mongoose from "mongoose";

const BinLocationSchema = new mongoose.Schema({

    AreaID: { type: mongoose.Schema.Types.ObjectId, ref: 'AreaWardMaster', required: true },
    BinLocCode: String,
    BinLocID: mongoose.Schema.Types.Int32,
    BinLocName: String,
    CreatedBy: String,
    CreatedOn: Date,
    Description: String,
    Latitude: mongoose.Schema.Types.Decimal128,
    LocationName: String,
    LocImage: String,
    Longitude: mongoose.Schema.Types.Decimal128,
    RFID: String,
    UpdatedBy: String,
    UpdatedOn: Date,
    ZoneID: mongoose.Schema.Types.Int32,

}, {timestamps: true, collection: "BinLocation"})

export const BinLocation = mongoose.model("BinLocation", BinLocationSchema)