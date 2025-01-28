import mongoose from "mongoose";


export const NTSchema = new mongoose.Schema(
  {
    "TrackTime": Date,
    "Longitude": Number,
    "Lattitude": Number,
    "speed": Number,
    "devid": String,
    "BinVisited": String,
    "acc": Boolean,
    "pos": Boolean,
    "overspeed": Boolean,
    "StateInfo": String,
    "distance": Number,
    "nearme": String,
    "SecondsRun": Number,
    "speedDecimal": Number,
    "currtime1": Date,
    "description": String,
    "AreaId": Number,
    "SecondsIdle": Number,
    "SecondsStop": Number,
    "Secondsrunv": Number,
    "Flag": String,
    "locationread": String,
    "TrackDate": Date,
    "IdCom": Number
  },
  { collection: "NT" }
);


export const NT = mongoose.model("NT", NTSchema);
