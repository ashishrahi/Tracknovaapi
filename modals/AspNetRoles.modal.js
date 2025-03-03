import mongoose, { Schema, model } from "mongoose";

const AspNetRolesSchema = new Schema(
  {
    Id: { type: String,  trim: true },
    Name: { type: String, required: true, trim: true },
    NormalizedName: { type: String,  trim: true, uppercase: true },
    ConcurrencyStamp: { type: String, trim: true },
  },
  { timestamps: true, collection: "AspNetRoles" }
);

export const AspNetRoles = mongoose.model("AspNetRoles", AspNetRolesSchema);
