import mongoose from "mongoose";


const SubscriptionRequestSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  industryType: { type: String, default: "Vehicle Tracking Service" },
  fleetSize: { type: Number, default: 10 },
  country: { type: String, default: "India" },
  adminName: { type: String, required: true, trim: true },
  adminEmail: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  requestedPlan: { type: String, enum: ["Basic", "Pro", "Enterprise"], required: true },
  status: { type: String, enum: ["Pending", "Contacted", "Paid", "Rejected"], default: "Pending" },
  notes: { type: String }, // Notes from admin after contacting
}, { timestamps: true });


const SubscriptionRequest = mongoose.model("SubscriptionRequest", SubscriptionRequestSchema);

export default SubscriptionRequest;
