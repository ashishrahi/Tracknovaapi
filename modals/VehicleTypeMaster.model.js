import mongoose from "mongoose";

const Schema = mongoose.Schema;
export const VehicleTypeMasterSchema = new Schema({
    CreatedBy: String,
    ShortName: String,
    UpdatedBy: String,
    VehicleCode: String,
    VehicleTypeId: {
        type: Number,
        required: true,
        unique: true
    },
    VehicleTypename: {
        type: String,
        required: true,
        trim : true,
        set: (value) => {
            return value
              .split(" ") // Split string into words
              .map(
                (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
              ) // Capitalize each word
              .join(" ");
        },
        uppercase: true
    },
}, {timestamps: true, collection: "VehicleTypeMaster"})

const VehicleTypeMaster = mongoose.model("VehicleTypeMaster", VehicleTypeMasterSchema)

export default VehicleTypeMaster;

