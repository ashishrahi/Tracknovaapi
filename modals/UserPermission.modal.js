import mongoose from "mongoose";

export const UserPermissionSchema = new mongoose.Schema(
  {
    UserId: {
      type: String, // UUID as a string
      required: true,
      index: true,
    },
    MenuId: {
      type: Number,
      required: true,
    },
    ParentId: {
      type: mongoose.Schema.Types.Mixed,
      // default: null, // If ParentId is optional
    },
    IsAdd: { type: Boolean, default: false },
    IsEdit: { type: Boolean, default: false },
    IsDel: { type: Boolean, default: false },
    IsView: { type: Boolean, default: false },
    IsPrint: { type: Boolean, default: false },
    IsExport: { type: Boolean, default: false },
    IsRelease: { type: Boolean, default: false },
    IsPost: { type: Boolean, default: false },
  },
  { timestamps: true, collection: "UserPermission" }
);

const UserPermission = mongoose.model("UserPermission", UserPermissionSchema);

export { UserPermission };
