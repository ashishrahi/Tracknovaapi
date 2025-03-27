import mongoose from "mongoose";


const SubscriptionRequestSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
  },

  customerName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },

  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },

  industryType: { type: String }, // Optional field to match the company model

  fleetSizeRequirement: { type: Number, default: 0 }, // Matches `fleetSize` from Company model

  subscriptionPreference: {
    plan: {
      type: String,
      enum: ["Basic", "Pro", "Enterprise"],
      required: true,
    },
    preferredStartDate: { type: Date, required: true },
  },
  notes: { type: String }, // Notes from admin after contacting
}, { timestamps: true });


const SubscriptionRequest = mongoose.model("SubscriptionRequest", SubscriptionRequestSchema);

export default SubscriptionRequest;

