import mongoose, { Schema, model } from "mongoose";

const DesignationSchema = new Schema(
  {
    DesignationId: { type: Number, required: true, unique: true, index: true },
    DesignationName: { type: String, required: true, trim: true },
    DesignationCode: { type: String, required: true, trim: true, unique: true },
    CreatedBy: { type: String, trim: true },
    UpdatedBy: { type: String, trim: true },
  },
  { timestamps: true, collection: "Designation" } 
);

export const Designation = model("Designation", DesignationSchema);
