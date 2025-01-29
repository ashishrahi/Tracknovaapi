import mongoose from "mongoose";


export const EmpMasterSchema = new mongoose.Schema({
   
    "Empid": Number,
    "EmpName": String,
    "EmpCode": String,
    "EmpPerAddress": String,
    "EmpLocalAddress": String,
    "EmpFatherName": String,
    "EmpspauseName": String,
    "EmpMotherName": String,
    "EmpMobileNo": String,
    "EmpStatus": String,
    "EmpPanNumber": String,
    "EmpAddharNo": String,
    "EmpDob": Date,
    "EmpJoiningDate": Date,
    "EmpretirementDate": Date,
    "EmpDesignationId": Number,
    "EmpDeptId": Number,
    "EmpStateId": Number,
    "EmpCountryID": Number,
    "EmpCityId": Number,
    "EmpPincode": Number,
    "CreatedBy": String,
    "UpdatedBy": String,
    "CreatedOn": Date,
    "UpdatedOn": Date,
    "UserId": String,
    "RoleId": String,
    "ImageFile": Buffer,
    "SignatureFile": Buffer,
    "Email": String,
    "DLNO": String,
    "Gender": String,
    "EZoneID": Number,
}, { collection: "EmpMaster" })

export const EmpMaster = mongoose.model("EmpMaster", EmpMasterSchema);