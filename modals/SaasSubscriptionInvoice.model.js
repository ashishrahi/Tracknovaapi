import mongoose from "mongoose";

export const SaasSubscriptionInvoiceSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },
    provider: { type: String, enum: ["stripe", "razorpay"], required: true },
    providerInvoiceId: { type: String, trim: true, index: true },
    providerSubscriptionId: { type: String, trim: true, index: true },
    planCode: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: "INR", uppercase: true },
    status: {
      type: String,
      enum: ["created", "paid", "failed", "refunded"],
      default: "created",
      index: true,
    },
    periodStart: { type: Date },
    periodEnd: { type: Date },
    metadata: { type: Object, default: {} },
  },
  { timestamps: true }
);

const SaasSubscriptionInvoice = mongoose.model(
  "SaasSubscriptionInvoice",
  SaasSubscriptionInvoiceSchema
);

export default SaasSubscriptionInvoice;
