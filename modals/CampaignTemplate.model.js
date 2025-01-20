import mongoose from   "mongoose";

const CampaignTemplateSchema = new mongoose.Schema({

    
        TemplateId: {
          type: Number,
          required: true,
          unique: true
        },
        Template: {
          type: String,
          required: true,
          trim: true // Removes extra spaces from the beginning and end
        },
        TemplateType: {
          type: String,
          required: true,
        //   enum: ["EMAIL", "SMS", "PUSH"], // Restricts values to valid types
          uppercase: true // Ensures stored values are always uppercase
        },
        SMSTemplateId: {
          type: Number,
        //   default: null // Optional field
        },
        CreatedBy: {
          type: String,
          required: true,
          trim: true,
          
        },
        UpdatedBy: {
          type: String,
          required: true,
          trim: true
        }
      
    },{ timestamps: true, collection: "CampaignTemplate" } 
)

const CampaignTemplate = mongoose.model("CampaignTemplate", CampaignTemplateSchema);

export default CampaignTemplate;  