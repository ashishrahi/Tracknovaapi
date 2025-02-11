import mongoose from "mongoose";

const GeofencingSchema = new mongoose.Schema({
    AreaId: mongoose.Schema.Types.Mixed,
    CompanyId: mongoose.Schema.Types.Mixed,
    DateSave: mongoose.Schema.Types.Date,
    FenceId: mongoose.Schema.Types.Int32,
    FenceName: String,
    flag: Boolean,
    Lattitude: mongoose.Schema.Types.Decimal128,
    Longitude: mongoose.Schema.Types.Decimal128,
    polycord: mongoose.Schema.Types.Mixed,
    Radius: mongoose.Schema.Types.Mixed,
    
}, {timestamps: true, collection: "Geofencing"})

const Geofencing = mongoose.model("Geofencing", GeofencingSchema);

export default Geofencing;