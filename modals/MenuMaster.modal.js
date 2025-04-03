import mongoose, { Schema, model } from "mongoose";

export const MenuSchema = new Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,  // Ensure ObjectId type
    MenuId: { type: Number, required: true, unique: true, index: true },
    MenuName: { type: String, required: true, trim: true },
    ParentId: { type: mongoose.Schema.Types.Mixed },
    PageUrl: { type:  mongoose.Schema.Types.Mixed , trim: true },
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
