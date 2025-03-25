import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  industryType: { type: String },
  fleetSize: { type: Number },
  city: { type: String },
  state: { type: String },
  pincode: { type: Number },
  country: { type: String },
  admin: {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true }, // Hashed password
  },
  subscription: {
    plan: { type: String, enum: ["Basic", "Pro", "Enterprise"], required: true },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    status: { type: String, enum: ["Active", "Suspended", "Expired"], default: "Active" },
  },
  database: {
    dbName: { type: String, unique: true },
    backupEnabled: { type: Boolean, default: false }
  }
});

const Company = mongoose.model("Company", CompanySchema);

export default Company;