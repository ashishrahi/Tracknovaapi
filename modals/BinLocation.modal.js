import mongoose from "mongoose";

const BinLocationSchema = new mongoose.Schema(
  {
    AreaID: Number,
    BinLocCode: String,
    BinLocID: Number,
    BinLocName: String,
    CreatedBy: { type: Object },
    CreatedOn: { type: Object },
    Description: String,
    Latitude: mongoose.Schema.Types.Decimal128,
    LocationName: String,
    LocImage: String,
    Longitude: Number,
    RFID: String,
    UpdatedBy: { type: Object },
    UpdatedOn: { type: Object },
    ZoneID: Number,
  },
  { timestamps: true, collection: "BinLocation" }
);

export const BinLocation = mongoose.model("BinLocation", BinLocationSchema);
