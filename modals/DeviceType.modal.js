import mongoose, { Schema, model } from "mongoose";

export const DeviceTypeSchema = new Schema(
  {
    Id: { type: Number, required: true, unique: true, index: true },
    dtype: { type: String, required: true, trim: true },
  },
  {timestamps:true, collection: "DeviceType" }
);

export const DeviceType = model("DeviceType", DeviceTypeSchema);
