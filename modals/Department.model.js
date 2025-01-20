import mongoose from "mongoose";

const DepartmentSchema = new mongoose.Schema({
    CreatedBy: String,
    DepartmentId: mongoose.Schema.Types.Int32,
    DepartmentName: String,
    DepartmentShortname: String,
    HOD: mongoose.Schema.Types.Int32,
    UpdatedBy: String,
}, {timestamps: true, collection: "Department"})

const Department = mongoose.model("Department", DepartmentSchema)

export default Department;