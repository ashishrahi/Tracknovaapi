import mongoose from "mongoose";

const RolePermissionSchema = new mongoose.Schema({
    IsAdd : Boolean,
    IsDel: Boolean,
    IsEdit: Boolean,
    IsExport: Boolean,
    IsPost: Boolean,
    IsPrint:Boolean,
    IsRelease:Boolean,
    IsView:Boolean,
    MenuId:mongoose.Schema.Types.Int32,
    ParentId:mongoose.Schema.Types.Int32,
    RoleId:String,
}, {timestamps: true, collection: "RolePermission"})

export const RolePermission = mongoose.model("RolePermission", RolePermissionSchema)