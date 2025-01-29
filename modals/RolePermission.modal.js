import mongoose from "mongoose";

const RolePermissionSchema = new mongoose.Schema({
    RoleId:String,
    MenuId:Number,
    ParentId:Number,
    IsAdd : Boolean,
    IsDel: Boolean,
    IsEdit: Boolean,
    IsExport: Boolean,
    IsPost: Boolean,
    IsPrint:Boolean,
    IsRelease:Boolean,
    IsView:Boolean,
    
}, {timestamps: true, collection: "RolePermission"})

export const RolePermission = mongoose.model("RolePermission", RolePermissionSchema)