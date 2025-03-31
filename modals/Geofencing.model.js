import mongoose from "mongoose";

export const GeofencingSchema = new mongoose.Schema({
    AreaId: mongoose.Schema.Types.Mixed,
    CompanyId: mongoose.Schema.Types.Mixed,
    DateSave: mongoose.Schema.Types.Date,
    FenceId: mongoose.Schema.Types.Int32,
    FenceName: String,
    flag: Boolean,
    Lattitude: {
        type: mongoose.Schema.Types.Decimal128,
        get: v => (v ? parseFloat(v.toString()) : null) // Convert Decimal128 to Number
    },
    Longitude: {
        type: mongoose.Schema.Types.Decimal128,
        get: v => (v ? parseFloat(v.toString()) : null) // Convert Decimal128 to Number
    },

    polycord: mongoose.Schema.Types.Mixed,
    Radius: {
        type:mongoose.Schema.Types.Mixed,
        get: v => (v ? parseFloat(v.toString()) : null) // Convert Decimal128 to Number
    },
    
}, {timestamps: true, collection: "Geofencing", 
    toJSON: { getters: true }, // Enable getters when converting to JSON
    toObject: { getters: true } // Enable getters when using .toObject()
 })

const Geofencing = mongoose.model("Geofencing", GeofencingSchema);

export default Geofencing;