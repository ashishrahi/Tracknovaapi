import mongoose from "mongoose";

const Schema = mongoose.Schema;
const VehicleTypeMasterSchema = new Schema({
    CreatedBy: String,
    CreatedOn: mongoose.Schema.Types.Date,
    ShortName: String,
    UpdatedBy: String,
    UpdatedOn: mongoose.Schema.Types.Date,
    VehicleCode: String,
    VehicleTypeId: Number,
    VehicleTypename: String,
}, {timestamps: true, collection: "VehicleTypeMaster"})

const VehicleTypeMaster = mongoose.model("VehicleTypeMaster", VehicleTypeMasterSchema)

export default VehicleTypeMaster;

