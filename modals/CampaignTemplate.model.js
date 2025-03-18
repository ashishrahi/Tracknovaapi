import mongoose from   "mongoose";

const CampaignTemplateSchema = new mongoose.Schema({
        TemplateId: {
          type: mongoose.Schema.Types.Int32,
          required: true,
          unique: true
        },
        Template: {
          type: String,
          required: [true, "Template Message is required"],
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
          trim: true,
          required: [true, "Please provide valid CreatedBy user name."],
        },
        UpdatedBy: {
          type: String,
          trim: true,
          required: [true, "Please provide valid UpdatedBy user name."],
        }
      
    },{ timestamps: true, collection: "CampaignTemplate" } 
)

const CampaignTemplate = mongoose.model("CampaignTemplate", CampaignTemplateSchema);

export default CampaignTemplate;  