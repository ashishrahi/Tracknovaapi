import mongoose from "mongoose";

export const EmailSettingSchema = new mongoose.Schema({
  Id: {
    type: Number,
    required: true,
    unique: true,
    min: 1,
  },
 UserName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
  },
  Email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
  },
  Password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 20,
  },
  Host: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    match: [/^([a-zA-Z0-9.-]+)$/, "Invalid host format"],
  },
  Port: {
    type: Number,
    required: true,
    min: 1,
    max: 65535,
  },
  // IsTls: {
  //   type: Boolean,
  //   required: true,
  //   default: false,
  // },
  // IsSSl: {
  //   type: Boolean,
  //   required: true,
  //   default: false,
  // },
  IsActive: {
    type: Boolean,
    required: true,
    default: true,
  },
}, {timestamps: true, collection: "EmailSetting"});

const EmailSetting = mongoose.model("EmailSetting", EmailSettingSchema);

export default EmailSetting;
