import mongoose from "mongoose";

export const CompanySchema = new mongoose.Schema({
  companyName: { type: String, required: true, trim: true, minlength: 3, maxlength: 100 },

  industryType: { type: String, trim: true },

  fleetSize: { type: Number, min: 1, default: 0 },

  companyPhone: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/, // Ensures exactly 10 digits
    trim: true
  },

  companyEmail: { type: String, required: true, lowercase: true, trim: true },

  pan: {
    type: String,
    // match: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, // PAN format validation
    uppercase: true,
    trim: true
  },

  aadhaar: {
    type: String,
    match: /^[0-9]{12}$/, // Aadhaar must be 12 digits
    trim: true
  },

  companyAddress: { type: String, required: true, trim: true },

  pincode: { type: String, required: true, match: /^[0-9]{6}$/, trim: true },

  city: { type: String, required: true, trim: true },

  state: { type: String, required: true, trim: true },

  country: { type: String, required: true, trim: true },

  admin: {
    name: { type: String, required: true, trim: true },
    email:  { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, match: /^[0-9]{10}$/, trim: true },
    role: {
      type: String,
      required: true,
      enum: ["SuperAdmin", "Admin", "User"]
    }
  },

  subscription: {
    plan: { type: String, required: true, enum: ["Basic", "Pro", "Enterprise", "Trial"] },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    status: { type: String, required: true, enum: ["Pending", "Active", "Suspended", "Expired"], default: "Active" },
    billing: {
      provider: { type: String, enum: ["stripe", "razorpay"], default: "razorpay" },
      customerId: { type: String, trim: true, default: "" },
      subscriptionId: { type: String, trim: true, default: "" },
      autoRenew: { type: Boolean, default: true },
    }
  },

  database: {
    dbName: { type: String, required: true, unique: [true, "This Db name already present"], trim: true },
    backupEnabled: { type: Boolean, default: false }
  },

  /**
   * Tenant-scoped login: short code (e.g. KANPUR1). Unique when set; backfilled by migration for existing companies.
   */
  companyCode: {
    type: String,
    trim: true,
    uppercase: true,
    maxlength: 20,
  },
  /**
   * URL-style workspace identifier (e.g. kanpur-corp). Unique when set; pair with companyCode for SaaS sign-in.
   */
  workspaceSlug: {
    type: String,
    trim: true,
    lowercase: true,
    maxlength: 64,
  },

  /**
   * Central-DB provisioning lifecycle after signup ({@link signup.worker.js} tenant setup).
   */
  status: {
    type: String,
    enum: ["pending", "ready", "failed"],
    default: "pending",
  },

  /**
   * Custom hostnames for domain-based tenant routing (e.g. app.acme.com). verified after DNS/workflow checks.
   */
  customDomains: {
    type: [
      {
        domain: {
          type: String,
          required: true,
          trim: true,
          lowercase: true,
        },
        verified: {
          type: Boolean,
          default: false,
        },
      },
    ],
    default: [],
  },

  /**
   * Optional per-tenant login page branding (SaaS subdomain login). All fields optional.
   */
  loginBranding: {
    logoUrl: { type: String, trim: true, maxlength: 2_200_000 },
    /** Hex color, e.g. #2563EB */
    primaryColor: { type: String, trim: true, maxlength: 32 },
    /** Shown in help/support; optional override of company email. */
    supportEmail: { type: String, trim: true, lowercase: true, maxlength: 254 },
  },
},
  { timestamps: true });

CompanySchema.index({ companyCode: 1 }, { unique: true, sparse: true });
CompanySchema.index({ workspaceSlug: 1 }, { unique: true, sparse: true });
CompanySchema.index({ "customDomains.domain": 1 });

const Company = mongoose.model("Company", CompanySchema);

export default Company;