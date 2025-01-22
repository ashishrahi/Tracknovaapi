import mongoose, { trusted } from "mongoose";

const ItemTypeMasterSchema = new mongoose.Schema({
  itemTypeMasterId: {
    type: Number,
    required: true,
    unique: true,
  },
  itemType: {
    type: String,
    required: true,
    trim: true
  },
  itemTypeCode: {
    type: String,
    required: true,
    trim: true
  },
  createdBy: {
    type: String,
    required: true,
    trim: true
  },
  updatedBy: {
    type: String,
    trim: true
  },
}, {timestamps: true, collection: "ItemTypeMaster"});

const ItemTypeMaster = mongoose.model("ItemTypeMaster", ItemTypeMasterSchema);

export default ItemTypeMaster;
