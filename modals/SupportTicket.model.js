import mongoose from "mongoose";

export const SupportTicketSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },
    dbName: { type: String, trim: true },
    title: { type: String, required: true, trim: true, minlength: 4, maxlength: 200 },
    description: { type: String, required: true, trim: true, maxlength: 4000 },
    priority: { type: String, enum: ["low", "medium", "high", "critical"], default: "medium" },
    status: {
      type: String,
      enum: ["open", "in_progress", "resolved", "closed"],
      default: "open",
      index: true,
    },
    createdBy: {
      userId: { type: String },
      username: { type: String },
      email: { type: String },
      role: { type: String },
    },
    assignedTo: {
      userId: { type: String },
      username: { type: String },
      email: { type: String },
    },
    resolutionNote: { type: String, trim: true, maxlength: 2000 },
  },
  { timestamps: true }
);

const SupportTicket = mongoose.model("SupportTicket", SupportTicketSchema);

export default SupportTicket;
