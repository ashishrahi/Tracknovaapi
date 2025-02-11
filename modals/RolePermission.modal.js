import mongoose, { Schema, model } from "mongoose";

const RolePermissionSchema = new Schema(
  {
    RoleId: { type: String},
    MenuId: { type: Number, },
    ParentId: { type: Number },
    IsAdd: { type: Boolean, default: false },
    IsDel: { type: Boolean, default: false },
    IsEdit: { type: Boolean, default: false },
    IsExport: { type: Boolean, default: false },
    IsPost: { type: Boolean, default: false },
    IsPrint: { type: Boolean, default: false },
    IsRelease: { type: Boolean, default: false },
    IsView: { type: Boolean, default: false },
    MenuName:{ type:String }
  },
  { timestamps: true, collection: "RolePermission" }
);

export const RolePermission = model("RolePermission", RolePermissionSchema);
