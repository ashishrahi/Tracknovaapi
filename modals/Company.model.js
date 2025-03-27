import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema({
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
    match: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, // PAN format validation
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
    plan: { type: String, required: true, enum: ["Basic", "Pro", "Enterprise"] },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    status: { type: String, required: true, enum: ["Active", "Suspended", "Expired"], default: "Active" }
  },

  database: {
    dbName: { type: String, required: true, unique: [true, "This Db name already present"], trim: true },
    backupEnabled: { type: Boolean, default: false }
  }
},
  { timestamps: true });

const Company = mongoose.model("Company", CompanySchema);

export default Company;