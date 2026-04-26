import mongoose from "mongoose";

export const TenantUsageMetricSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },
    dbName: { type: String, required: true, trim: true, index: true },
    metricDate: { type: Date, required: true, index: true },
    users: { type: Number, min: 0, default: 0 },
    vehicles: { type: Number, min: 0, default: 0 },
    activeDevices: { type: Number, min: 0, default: 0 },
    apiCalls: { type: Number, min: 0, default: 0 },
  },
  { timestamps: true }
);

TenantUsageMetricSchema.index({ companyId: 1, metricDate: 1 }, { unique: true });

const TenantUsageMetric = mongoose.model("TenantUsageMetric", TenantUsageMetricSchema);

export default TenantUsageMetric;
