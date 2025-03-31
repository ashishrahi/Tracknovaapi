import mongoose, { Schema, model } from "mongoose";

export const RosterPlanSchema = new Schema(
  {
    RosterID: { type: Number, required: true, unique: true },
    RosterNo: { type: String, required: true, trim: true },
    RosterDate: { type: Date, required: true },
    FromDate: { type: Date, required: true },
    ToDate: { type: Date, },
    CreatedBy: { type: String, required: true, trim: true },
    UpdatedBy: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
    collection: "RosterPlan",
  }
);



export const RosterPlan = model("RosterPlan", RosterPlanSchema);
