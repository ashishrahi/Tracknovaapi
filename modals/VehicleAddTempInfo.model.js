// VehicleAddTempInfo
import mongoose from "mongoose";

export const VehicleAddTempInfoSchema = new mongoose.Schema(
  {
    VehicleNo: { type: String, required: true },
    VehicleId: { type: String, default: null },
    SimNo: { type: String, required: true },
    DeviceNo: { type: String,  },
    ProblemType: { type: String,  },
    Remark: {
      type: String,
      default: null,
      set: (value) => {
        return value
          .split(" ") // Split string into words
          .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          ) // Capitalize each word
          .join(" ");
      },
    },
    ImageFile: { type: Buffer }, // To store binary data
    Createdby: { type: String,  trim: true },
    UpdatedBy: { type: String,  trim: true },
    Id: { type: Number, required: true },
    ServiceEngg: {
      type: String,
      required: true,
      set: (value) => {
        return value
          .split(" ") // Split string into words
          .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          ) // Capitalize each word
          .join(" ");
      },
    },
    OlddeviceNo: { type: String, 
        // required: true, 
        trim: true },
    OldSimNo: { type: String, required: true, trim: true },
    EmpName: {
      type: String,
      required: true,
      set: (value) => {
        return value
          .split(" ") // Split string into words
          .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          ) // Capitalize each word
          .join(" ");
      },
    },
    EmpMobileNo: { type: String, required: true, trim: true },
    EmpId: { type: Number, required: true },
    DeviceType: { type: String, required: true, trim: true, uppercase: true },
    SimType: { type: String, default: null },
    Replacement: {
      type: String,
      required: true,
      set: (value) => {
        return value
          .split(" ") // Split string into words
          .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          ) // Capitalize each word
          .join(" ");
      },
    },
    WorkType: {
      type: String,
      required: true,
      set: (value) => {
        return value
          .split(" ") // Split string into words
          .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          ) // Capitalize each word
          .join(" ");
      },
    },
    CompanyName: { type: String, default: null },
    Repair: { type: Boolean, required: true },
  },
  { timestamps: true, collection: "VehicleAddTempInfo" }
);

const VehicleAddTempInfo = mongoose.model(
  "VehicleAddTempInfo",
  VehicleAddTempInfoSchema
);

export default VehicleAddTempInfo;
