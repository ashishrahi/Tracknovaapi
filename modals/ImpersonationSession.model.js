import mongoose from "mongoose";

export const ImpersonationSessionSchema = new mongoose.Schema(
  {
    superAdminUserId: { type: String, required: true, index: true },
    superAdminUsername: { type: String, required: true, trim: true },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },
    companyDbName: { type: String, required: true, trim: true },
    targetUsername: { type: String, trim: true, default: "tenant_admin" },
    reason: { type: String, trim: true, maxlength: 500 },
    startedAt: { type: Date, required: true, default: Date.now },
    endedAt: { type: Date, default: null },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

const ImpersonationSession = mongoose.model("ImpersonationSession", ImpersonationSessionSchema);

export default ImpersonationSession;
