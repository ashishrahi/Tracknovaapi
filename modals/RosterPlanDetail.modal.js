import mongoose from "mongoose";

export const RosterPlanDetailSchema = new mongoose.Schema(
  {
    RosterDetailID: { type: Number, required: true, unique: true },
    RosterID: { type: Number, required: true },
    EmpId: { type: Number, required: true },
    VehicleID: { type: Number, required: true },
    HandheldID: { type: Number, required: true },
    RouteID: { type: Number, required: true },
    CreatedBy: { type: String, required: true, trim: true },
    UpdatedBy: { type: String, required: true, trim: true },
  },
  {
    timestamps: true, 
    collection: "RosterPlanDetail",
  }
);

export const RosterPlanDetail = mongoose.model("RosterPlanDetail", RosterPlanDetailSchema);
