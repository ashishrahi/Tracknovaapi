import mongoose from "mongoose";

const ItemCategoryMasterSchema = new mongoose.Schema(
  {
    ItemCategoryId: {
      type: Number,
      required: true,
      unique: true,
    },
    ItemCategory: {
      type: String,
      required: true,
      
      set: (value) => {
        return value
          .split(" ") // Split string into words
          .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          ) // Capitalize each word
          .join(" ");
      }
    },
    ItemCategoryAbbre: {
      type: String,
      required: true,
      
      set: (value) => {
        return value
          .split(" ") // Split string into words
          .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          ) // Capitalize each word
          .join(" ");
      }
    },
    ParentId: {
      type: Number,
      default: null,
    },
    TaxId: {
      type: Number,
      required: true,
    },
    CreatedBy: {
      type: String,
      required: true,
    },
    UpdatedBy: {
      type: String,
    },
  },
  { timestamps: true, collection: "ItemCategoryMaster" }
);

const ItemCategoryMaster = mongoose.model(
  "ItemCategoryMaster",
  ItemCategoryMasterSchema
);

export default ItemCategoryMaster;
