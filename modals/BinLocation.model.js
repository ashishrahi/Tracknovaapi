import mongoose from "mongoose";

const BinLocationSchema = new mongoose.Schema({

    AreaID: Number,
    BinLocCode: String,
    BinLocID: Number,
    BinLocName: String,
    CreatedBy: {type: Object},
    CreatedOn: {type: Object},
    Description: String,
    Latitude: mongoose.Schema.Types.Decimal128,
    LocationName: String,
    LocImage: String,
    Longitude: mongoose.Schema.Types.Decimal128,
    RFID: String,
    UpdatedBy: {type: Object},
    UpdatedOn: {type: Object},
    ZoneID: mongoose.Schema.Types.Int32,

}, {timestamps: true, collection: "BinLocation"})

export const BinLocation = mongoose.model("BinLocation", BinLocationSchema)