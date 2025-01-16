import mongoose from "mongoose";

const EmpMasterSchema = new mongoose.Schema({
    
    CreatedBy: String,
    DLNO: String,
    Email: String,
    EmpAddharNo: String,
    EmpCityId: mongoose.Schema.Types.Int32,
    EmpCode: String,
    EmpCountryID: mongoose.Schema.Types.Int32,
    EmpDeptId: mongoose.Schema.Types.Int32,
    EmpDesignationId: mongoose.Schema.Types.Int32,
    EmpDob: mongoose.Schema.Types.Date,
    EmpFatherName: String,
    Empid: mongoose.Schema.Types.Int32,
    EmpJoiningDate: mongoose.Schema.Types.Date,
    EmpLocalAddress: String,
    EmpMobileNo: String,
    EmpMotherName: String,
    EmpName: String,
    EmpPanNumber: String,
    EmpPerAddress: String,
    EmpPincode: mongoose.Schema.Types.Int32,
    EmpretirementDate: mongoose.Schema.Types.Date,
    EmpspauseName: String,
    EmpStateId: mongoose.Schema.Types.Int32,
    EmpStatus: String,
    EZoneID: mongoose.Schema.Types.Int32,
    Gender: String,
    ImageFile: mongoose.Schema.Types.Mixed,
    RoleId: mongoose.Schema.Types.Mixed,
    SignatureFile: mongoose.Schema.Types.Mixed,
    UserId: mongoose.Schema.Types.Mixed
}, {timestamps: true , collation: "EmpMaster"})

const EmpMaster = mongoose.model("EmpMaster", EmpMasterSchema)

export default EmpMaster;