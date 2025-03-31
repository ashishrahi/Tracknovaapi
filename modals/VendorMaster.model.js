import mongoose from "mongoose";

export const VendorMasterSchema = new mongoose.Schema({
    "VenderId": {
        type: Number,
        require: true,
        unique: true
    },
    "Name": {
        type: String,
        require: true,
        set: (value) => {
            return value
              .split(" ") // Split string into words
              .map(
                (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
              ) // Capitalize each word
              .join(" ");
        }  
    },
    "Code": String,
    "PermanentAddress": String,
    "ContactPerson": {
        type: String,
        require: true,
        set: (value) => {
            return value
              .split(" ") // Split string into words
              .map(
                (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
              ) // Capitalize each word
              .join(" ");
        }  
    },
    "MobileNo": String,
    "PanNumber": {
        type: String,
        uppercase: true
    },
    "AddharNo": String,
    "GstinNo": String,
    "StateId": Number,
    "CountryId": Number,
    "CityId": Number,
    "Pincode": Number,
    "CreatedBy": String,
    "UpdatedBy": String,
    "ImageFile": mongoose.Schema.Types.Mixed,
    "SignatureFile": mongoose.Schema.Types.Mixed,
}, {timestamps: true, collection: "VendorMaster" });

const VendorMaster = mongoose.model("VendorMaster", VendorMasterSchema);

export default VendorMaster;