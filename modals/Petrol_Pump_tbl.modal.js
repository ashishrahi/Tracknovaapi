import mongoose, { Schema, model } from "mongoose";

const Petrol_Pump_tblSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    PetroPump: { type: String, required: true, trim: true },
    CityId: { type: Number, required: true, index: true },
    StateId: { type: Number, required: true },
  },
  { collection: "Petrol_Pump_tbl" }
);

export const Petrol_Pump_tbl = model("Petrol_Pump_tbl", Petrol_Pump_tblSchema);
