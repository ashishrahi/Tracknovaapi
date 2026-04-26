import mongoose from "mongoose";

export const CompanyAuditLogSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },
    action: { type: String, required: true, trim: true, maxlength: 80 },
    details: { type: mongoose.Schema.Types.Mixed, default: {} },
    performedBy: {
      userId: { type: mongoose.Schema.Types.ObjectId },
      username: { type: String, trim: true },
      role: { type: String, trim: true },
    },
  },
  { timestamps: true }
);

CompanyAuditLogSchema.index({ companyId: 1, createdAt: -1 });

const CompanyAuditLog = mongoose.model("CompanyAuditLog", CompanyAuditLogSchema);
export default CompanyAuditLog;
