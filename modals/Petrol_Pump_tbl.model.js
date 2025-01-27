import mongoose from "mongoose";


export const Petrol_Pump_tblSchema = new mongoose.Schema({
    "id": Number,
    "PetroPump": String,
    "CityId": Number,
    "StateId": Number,
}, { collection: "Petrol_Pump_tbl" })

export const Petrol_Pump_tbl = mongoose.model("Petrol_Pump_tbl", Petrol_Pump_tblSchema);