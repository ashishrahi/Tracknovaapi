import mongoose from "mongoose";

const UserPermissionSchema = new mongoose.Schema({
  ParentId: {
    type: Number,
    required: true,
  },
  IsAdd: {
    type: Boolean,
    required: true,
  },
  IsEdit: {
    type: Boolean,
    required: true,
  },
  IsDel: {
    type: Boolean,
    required: true,
  },
  IsView: {
    type: Boolean,
    required: true,
  },
  IsPrint: {
    type: Boolean,
    required: true,
  },
  IsExport: {
    type: Boolean,
    required: true,
  },
  IsRelease: {
    type: Boolean,
    required: true,
  },
  IsPost: {
    type: Boolean,
    required: true,
  },
}, { collection: "UserPermission" });

const UserPermission = mongoose.model("UserPermission", UserPermissionSchema);

export { UserPermission };
