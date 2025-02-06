import mongoose from "mongoose";

const RouteAreaBinDetailSchema = new mongoose.Schema(
  {
    AreaID: { type: Number, required: true },  // Changed to Number for consistency
    BinID: { type: mongoose.Schema.Types.Int32, required: true },
    BinSelect: { type: Boolean},
    CreatedBy: { type: String, required: true, trim: true },
    RouteDetailBinId: { type: mongoose.Schema.Types.Int32, required: true },
    RouteDetailId: { type: mongoose.Schema.Types.Int32, required: true },
    RouteID: { type: mongoose.Schema.Types.Int32, required: true },
    SerialNo: { type: mongoose.Schema.Types.Int32, required: true },
    Timing: { type: Date, required: true },
    UpdatedBy: { type: String, trim: true },
    
  },
  {
    timestamps: true,
    collection: "RouteAreaBinDetail",
  }
);

export const RouteAreaBinDetail = mongoose.model("RouteAreaBinDetail", RouteAreaBinDetailSchema);
