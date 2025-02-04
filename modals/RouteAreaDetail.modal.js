import mongoose from "mongoose";

const RouteAreaDetailSchema = new mongoose.Schema(
  {
    RouteDetailId: { type: Number, required: true },
    RouteID: { type: Number},
    AreaID: { type: Number, required: true },
    CreatedBy: { type: String, required: true, trim: true },
    UpdatedBy: { type: String, required: true, trim: true },
  },
  {
    timestamps: true, 
    collection: "RouteAreaDetail",
  }
);

export const RouteAreaDetail = mongoose.model("RouteAreaDetail", RouteAreaDetailSchema);
