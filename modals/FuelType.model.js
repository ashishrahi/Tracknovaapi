import mongoose from "mongoose";

export const FuelTypeSchema = new mongoose.Schema(
  {
    FuelTypeId: {
        type: Number,
        require: true,
    },
    ShortName: String,
    FuelTypename: {
        type: String,
        uppercase: true,
        required: true,
        trim: true
    },
    FuelCode: {
        type:String,
        uppercase: true,
        required: true
    },
    CreatedBy: {
        type: String,
        trim: true,
    },
    UpdatedBy: {
        type: String,
        trim: true,
    },
  },
  { timestamps: true, collection: "FuelType" }
);

const FuelType = mongoose.model("FuelType", FuelTypeSchema);
export default FuelType;
