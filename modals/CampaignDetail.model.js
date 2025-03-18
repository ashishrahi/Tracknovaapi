import mongoose from "mongoose";

const CampaignDetailSchema = new mongoose.Schema({
  Id: {
    type: Number,
    required: true
  },
  CampaignId: {
    type: Number,
    required: [true, "Campaign ID is required"],
  },
  GroupId: {
    type: mongoose.Schema.Types.Mixed, // Accepts any type, as it can be null or a valid ID
  },
  MemberId: {
    type: Number,
    // required: [true, "Member ID is required"],
  },
  Message: {
    type: String,
    required: [true, "Message is required"],
  },
  EmailId: {
    type: String,
    required: [true, "Email ID is required"],
    default: "mailnotexists@gmail.com",
    validate: {
      validator: function (value) {
        // Check if the email is in valid format
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
      },
      message: "Invalid email format",
    },
  },
  MobileNo: {
    type: String,
    required: [true, "Mobile number is required"],
    default: "0000000000",
    match: [
      /^[0-9]{10}$/, // Ensure the number is 10 digits
      "Mobile number must be a valid 10-digit number",
    ],
  },
  ReceiverType: {
    type: String,
    // required: [true, "Receiver type is required"],
  },
}, {timestamps: true, collection: "CampaignDetail"});

const CampaignDetail = mongoose.model("CampaignDetail", CampaignDetailSchema);

export default CampaignDetail;
