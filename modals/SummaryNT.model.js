
import mongoose from "mongoose";


export const SummaryNTSchema = new mongoose.Schema({
    "DevID": {
        type: String,
        required: true,
    },
    "TrackDate": mongoose.Schema.Types.Date,
    "NTID": {
        type: Number,
        required: true,
    },
    "VehicleId": Number,
    "VehicleTypeId": Number,
    "VehicleNo": String,
    "EmpId": Number,
    "DriverName": {
        type: String,
        trim : true,
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
    "MobileNo": {
        type: String,
        trim: true
    },
    "Department": {
        type: String,
        trim : true,
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
    "VehicleType": {
        type: String,
        trim : true,
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
    "DistanceKm": Number,
    "RunningTime": Number,
    "RunningTimeText": {
        type: String,
        trim: true,
    },
    "IdleTime": Number,
    "IdleTimeText": {
        type: String,
        trim: true,
    },
    "StartTime": {
        type: String,
        trim: true,
    },
    "EndTime": {
        type: String,
        trim: true,
    },
    "StartLoc": {
        type: String,
        trim: true,
    },
    "EndLoc": {
        type: String,
        trim: true,
    },
    "KmPerLitre": Number,
    "LitrePerHr": Number,
    "FuelConsumption": {
        type: String,
        trim: true,
    },
    "FuelAlloted": {
        type: String,
        trim: true,
    },
    "OpeningBal": {
        type: String,
        trim: true,
    },
    "StopTime": Number,
    "StopTimeText": {
        type: String,
        trim: true,
    },
    "ModelNo": {
        type: String,
        trim: true,
    },
    "AvgSpeed": Number,
    "MaxSpeed": Number,
    "RunningIdleTime": Number,
    "RunningIdleTimeText": {
        type: String,
        trim: true,
    },
    "IsReset": Boolean,
    "PrevOpeningBal":{
        type: String,
        trim: true,
    },
    "ResetDate": Date,
}, {timestamps: true, collection: "SummaryNT" })

const SummaryNT = mongoose.model("SummaryNT", SummaryNTSchema);

export default SummaryNT;