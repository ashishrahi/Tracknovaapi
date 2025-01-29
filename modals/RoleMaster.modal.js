import mongoose from "mongoose";

const RoleMasterSchema = new mongoose.Schema({
    CreatedDt : Date,
    ModifyDt: Date,
    RoleID: String,
    RoleName: String,
    User_ID: String,
}, {timestamps: true, collection: "RoleMaster"})

export const RoleMaster = mongoose.model("RoleMaster", RoleMasterSchema)