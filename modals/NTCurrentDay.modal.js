import mongoose from "mongoose";

const NTCurrentDaySchema = new mongoose.Schema({
    acc : Boolean,
    AreaId: mongoose.Schema.Types.Mixed,
    BinVisited: String,
    currtime1: mongoose.Schema.Types.Date,
    description: String,
    devid: String,
    distance: mongoose.Schema.Types.Double,
    Flag: String,
    id: Number,
<<<<<<< HEAD:modals/NTCurrentDay.model.js
    Lattitude: mongoose.Schema.Types.Double,
    Longitude: mongoose.Schema.Types.Double,
=======
    Lattitude: { type: mongoose.Schema.Types.Decimal128, required: true },
    Longitude: { type: mongoose.Schema.Types.Decimal128, required: true },
>>>>>>> ashish:modals/NTCurrentDay.modal.js
    nearme: String,
    NTId: Number,
    overspeed: Boolean,
    pos: Boolean,
    SecondsIdle: mongoose.Schema.Types.Int32,
    SecondsRun: mongoose.Schema.Types.Int32,
    Secondsrunv: mongoose.Schema.Types.Int32,
    SecondsStop: mongoose.Schema.Types.Int32,
    speed: mongoose.Schema.Types.Int32,
    speedDecimal: mongoose.Schema.Types.Double,
    StateInfo: String,
    TrackDate: mongoose.Schema.Types.Date,
    TrackTime: mongoose.Schema.Types.Date,
}, {timestamps: true, collection: "NTCurrentDay"})

export const NTCurrentDay = mongoose.model("NTCurrentDay", NTCurrentDaySchema)