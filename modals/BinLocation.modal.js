import mongoose, { Schema, model } from "mongoose";

const BinLocationSchema = new Schema(
  {
    AreaID: { type: Number, index: true },  // Added index for better queries
    BinLocCode: { type: String, trim: true },
    BinLocID: { type: Number, required: true, unique: true, index: true },
    BinLocName: { type: String, required: true, trim: true },
    CreatedBy: { type: String, trim: true },
    CreatedOn: { type: Date, default: Date.now },  // Changed from Object to Date
    Description: { type: String, trim: true },
    Latitude: { type: mongoose.Schema.Types.Decimal128 },
    LocationName: { type: String, trim: true },
    LocImage: { type: String, trim: true },
    Longitude: { type: mongoose.Schema.Types.Decimal128 }, // Ensuring precision
    RFID: { type: String, trim: true, unique: true },
    UpdatedBy: { type: String, trim: true },
    UpdatedOn: { type: Date, default: Date.now },
    ZoneID: { type: Number, index: true },  // Added index
  },
  { timestamps: true, collection: "BinLocation" }
);

export const BinLocation = model("BinLocation", BinLocationSchema);
