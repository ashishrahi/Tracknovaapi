import mongoose from "mongoose";

const RouteAreaBinDetailSchema = new mongoose.Schema({
    AreaID : String,
    BinID: mongoose.Schema.Types.Int32,
    BinSelect: Boolean,
    CreatedBy: String,
    CreatedOn: Date,
    RouteDetailBinId: mongoose.Schema.Types.Int32,
    RouteDetailId: mongoose.Schema.Types.Int32,
    RouteID: mongoose.Schema.Types.Int32,
    SerialNo:mongoose.Schema.Types.Int32,
    Timing:Date,
    UpdatedBy:String,
    UpdatedOn:Date,
}, {timestamps: true, collection: "RouteAreaBinDetail"})

export const RouteAreaBinDetail = mongoose.model("RouteAreaBinDetail", RouteAreaBinDetailSchema)