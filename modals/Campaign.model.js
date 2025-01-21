import mongoose from "mongoose";

const CampaignSchema = new mongoose.Schema(
  {
    CampaignId: {
      type: Number,
      required: true,
      unique: true,
      //   index: true, // Improves query performance
    },
    CampaignName: {
      type: String,
      required: true,
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
    CampaignDate: {
      type: Date,
      required: true,
    },
    CampaignType: {
      type: String,
      required: true,
      uppercase: true, // Prevents invalid types
    },
    TemplateId: {
      type: mongoose.Schema.Types.Int32,
      required: true,
       // Supports both null and ObjectId
      // default: null,
    },
    Message: {
      type: String,
      required: true,
      trim: true,
    },
    Status: {
      type: String,
      required: true,
    //   enum: ["Immediately", "Scheduled", "Draft"], // Standardized values
    //   default: "Draft",
    },
    FromDate: {
      type: Date,
    
    },
    ToDate: {
      type: Date,
     
    },
    ToTime: {
      type: String, // Consider storing in HH:mm:ss format
    //   validate: {
    //     validator: function (v) {
    //       return !v || /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(v);
    //     },
    //     message: "Invalid time format. Use HH:mm:ss",
    //   },
    },
    CreatedBy: {
      type: String,
      required: true,
      trim: true,
    },
    UpdatedBy: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true, collection: "Campaign" }
);

const Campaign = mongoose.model("Campaign", CampaignSchema);

export default Campaign;
