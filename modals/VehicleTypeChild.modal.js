import mongoose from "mongoose";

export const VehicleTypeChildSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    VehicleTypeId: { type: Number, required: true },
    SessionD1: { type: Number, required: true },
    SessionD2: { type: Number, required: true },
    PetroId: { type: Number, required: true },
    PetroName: { type: String, required: true, trim: true },  // Added trim for PetroName
    EffectiveDate: { type: Date, required: true },
    CreatedBy: { type: String, required: true, trim: true },  // Trim to remove extra spaces
    UpdatedBy: { type: String, required: true, trim: true },
    FuelAlloted: { type: Number },
  },
  {
    timestamps: true, 
    collection: "VehicleTypeChild",
  }
);

export const VehicleTypeChild = mongoose.model("VehicleTypeChild", VehicleTypeChildSchema);
