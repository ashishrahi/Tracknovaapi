import mongoose, { Schema, model } from "mongoose";

const DepartmentSchema = new Schema(
  {
    DepartmentId: { type: Number, required: true, unique: true, index: true },
    DepartmentName: { type: String, required: true, trim: true },
    DepartmentShortname: { type: String, trim: true },
    HOD: { type: Number, index: true },
    CreatedBy: { type: String, trim: true },
    UpdatedBy: { type: String, trim: true },
  },
  { timestamps: true, collection: "Department" }
);

const Department = model("Department", DepartmentSchema);

export default Department;
