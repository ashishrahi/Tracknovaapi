import mongoose from "mongoose";

export const StateMasterSchema = new mongoose.Schema(
  {
    StateId: { type: Number},  // Added required: true for mandatory fields
    StateName: { type: String, required: true },
    StateCode: { type: String},
    CountryId: { type: Number, required: true },  // Changed to Number for consistency
    CreatedBy: { type: String,  trim: true },
    UpdatedBy: { type: String,  trim: true },
  },
  { timestamps: true, collection: "StateMaster" } // Mongoose will handle createdAt and updatedAt
);

export const StateMaster = mongoose.model("StateMaster", StateMasterSchema);
