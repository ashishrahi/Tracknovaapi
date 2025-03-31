import mongoose, { trusted } from "mongoose";

export const ItemTypeMasterSchema = new mongoose.Schema({
  ItemTypeMasterId: {
    type: Number,
    required: true,
    unique: true,
  },
  ItemType: {
    type: String,
    required: true,
    trim: true
  },
  ItemTypecode: {
    type: String,
    required: true,
    trim: true
  },
  CreatedBy: {
    type: String,
    required: true,
    trim: true
  },
  UpdatedBy: {
    type: String,
    trim: true
  },
}, {timestamps: true, collection: "ItemTypeMaster"});

const ItemTypeMaster = mongoose.model("ItemTypeMaster", ItemTypeMasterSchema);

export default ItemTypeMaster;
