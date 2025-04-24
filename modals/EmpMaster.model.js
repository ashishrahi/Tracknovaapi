import mongoose from "mongoose";

export const EmpMasterSchema = new mongoose.Schema({
  Empid: { type: Number, unique: true }, 
  EmpName: {
    type: String,
    // required: true, 
    trim: true,
    set: (value) => {
      return value
        .split(" ") // Split string into words
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ) // Capitalize each word
        .join(" ");
    }
  },
  EmpCode: {
    type: String,
    default: null 
    // required: true
  }, // Indexed for faster lookups
  EmpPerAddress: {
    type: String,
    //  required: true
  },
  EmpLocalAddress: {
    type: String,
    //  required: true
  },
  EmpFatherName: {
    type: String,
    default: null,
    set: (value) => {
      return value
        .split(" ") // Split string into words
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ) // Capitalize each word
        .join(" ");
    }
  },
  EmpspauseName: {
    type: String,
    default: null,
    set: (value) => {
      return value
        .split(" ") // Split string into words
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ) // Capitalize each word
        .join(" ");
    }
  },
  EmpMotherName: {
    type: String, 
    default: null,
    set: (value) => {
      return value
        .split(" ") // Split string into words
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ) // Capitalize each word
        .join(" ");
    }
  },
  EmpMobileNo: {
    type: String,
    // required: true, 
    match: [/^\d{10}$/, "Phone number must be 10 digits"], // Ensures only valid numbers
  }, // Mobile should be unique
  EmpStatus: { type: String, enum: ["Active", "Sleep"], default: "Sleep" },
  EmpPanNumber: {
    type: String,
    // required: [true, "PAN Number is required"],
    unique: true,
    match: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, // Validates PAN format
    trim: true
  },
  EmpAddharNo: {
    type: String,
    // required: [true, "Aadhar Number is required"], 
    unique: true,
    match: /^[2-9]{1}[0-9]{11}$/, // Validates Aadhar format (12 digits)
    trim: true
  },
  EmpDob: {
    type: Date,
    default: null
    // required: true
  },
  EmpJoiningDate: {
    type: Date,
    default: null
    // required: true
  },
  EmpRetirementDate: { type: Date, default: null },

  EmpDesignationId: {
    type: Number,
    default: null 
  },
  EmpDeptId: {
    type: Number,
    default: null 
  },
  EmpStateId: {
    type: mongoose.Schema.Types.Mixed
  },
  // EmpCountryID
  EmpCountryID: {
    type: mongoose.Schema.Types.Mixed
  },
  EmpCityId: {
    type: mongoose.Schema.Types.Mixed
  },
  EmpPincode: { type: mongoose.Schema.Types.Mixed },
  CreatedBy: { type: String, default: null  },
  UpdatedBy: { type: String, default: null  },
  UserId: { type: mongoose.Schema.Types.Mixed },
  RoleId: { type: mongoose.Schema.Types.Mixed },
  ImageFile: { type: mongoose.Schema.Types.Mixed, default: null }, // Can store file paths or cloud URLs
  SignatureFile: { type: mongoose.Schema.Types.Mixed, default: null },
  Email: { type: String, default: "mailnotexists@gmail.com", lowercase: true, trim: true, match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email format"], },
  DLNo: { type: String, default: null  }, // Driving License No.
  Gender: {
    type: String,
    default: null 
    // enum: ["Male", "Female", "Other"], 
    // required: true },
  },
  EZoneId: {
    type: Number,
    default: null
  },
}, { timestamps: true, collection: "EmpMaster" });

const EmpMaster = mongoose.model("EmpMaster", EmpMasterSchema);

export default EmpMaster;
