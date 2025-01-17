import mongoose from "mongoose";

const UserPermissionSchema = new mongoose.Schema({
  ParentId: {
    type: Number,
  },
  IsAdd: {
    type: Boolean,
  },
  IsEdit: {
    type: Boolean,
  },
  IsDel: {
    type: Boolean,
  },
  IsView: {
    type: Boolean,
  },
  IsPrint: {
    type: Boolean,
  },
  IsExport: {
    type: Boolean,
  },
  IsRelease: {
    type: Boolean,
  },
  IsPost: {
    type: Boolean,
  },
}, { collection: "UserPermission" });

const UserPermission = mongoose.model("UserPermission", UserPermissionSchema);

export { UserPermission };
