import mongoose from "mongoose";

const PeriodSchema = new mongoose.Schema({
    index: Number,
    StartDate: Date,
    EndDate: Date,
    DaysOnly: Boolean,
    DisplayLabel: String,
}, {timestamps: true, collection: "Period"})

const Period = mongoose.model("Period", PeriodSchema)

export default Period;