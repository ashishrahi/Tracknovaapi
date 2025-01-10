import mongoose from "mongoose";

const ntCurrentDaySchema = new mongoose.Schema({
    acc : Boolean,
    AreaId: mongoose.Schema.Types.Mixed,
    BinVisited: String,
    currtime1: mongoose.Schema.Types.Date,
    description: String,
    devid: String,
    distance: mongoose.Schema.Types.Decimal128,
    Flag: String,
    id: Number,
    Lattitude: mongoose.Schema.Types.Decimal128,
    Longitude: mongoose.Schema.Types.Decimal128,
    nearme: String,
    NTId: Number,
    overspeed: Boolean,
    pos: Boolean,
    SecondsIdle: mongoose.Schema.Types.Int32,
    SecondsRun: mongoose.Schema.Types.Int32,
    Secondsrunv: mongoose.Schema.Types.Int32,
    SecondsStop: mongoose.Schema.Types.Int32,
    speed: mongoose.Schema.Types.Int32,
    speedDecimal: mongoose.Schema.Types.Decimal128,
    StateInfo: String,
    TrackDate: mongoose.Schema.Types.Date,
    TrackTime: mongoose.Schema.Types.Date,
}, {timestamps: true})

export const ntCurrentDay = mongoose.model("User", ntCurrentDaySchema)