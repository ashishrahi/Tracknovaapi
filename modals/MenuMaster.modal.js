import mongoose, { Schema, model } from "mongoose";

const MenuSchema = new Schema(
  {
    MenuId: { type: Number, required: true, unique: true, index: true },
    MenuName: { type: String, required: true, trim: true },
    ParentId: { type: Number },
    PageUrl: { type: String, trim: true },
    Icon: { type: String, trim: true },
    DisplayNo: { type: Number },
    IsMenu: { type: Boolean, default: false },
    IsAdd: { type: Boolean, default: false },
    IsEdit: { type: Boolean, default: false },
    IsDel: { type: Boolean, default: false },
    IsView: { type: Boolean, default: false },
    IsPrint: { type: Boolean, default: false },
    IsExport: { type: Boolean, default: false },
    IsRelease: { type: Boolean, default: false },
    IsPost: { type: Boolean, default: false },
  },
  { timestamps: true, collection: "Menu" }
);

export const Menu = model("Menu", MenuSchema);
