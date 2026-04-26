import mongoose from "mongoose";

export const LifecycleEmailLogSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },
    eventType: {
      type: String,
      enum: ["trial_started", "trial_ending", "subscription_activated", "payment_failed", "renewal_success"],
      required: true,
      index: true,
    },
    to: { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, required: true },
    status: { type: String, enum: ["queued", "sent", "failed"], default: "queued", index: true },
    errorMessage: { type: String },
  },
  { timestamps: true }
);

const LifecycleEmailLog = mongoose.model("LifecycleEmailLog", LifecycleEmailLogSchema);

export default LifecycleEmailLog;
