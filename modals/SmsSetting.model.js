import mongoose from "mongoose";

export const SmsSettingSchema = new mongoose.Schema(
  {
    Id: {
        type: Number,
        required: true,
        unique: true,
        min: 1, // Ensures Id is positive
       
    },
    Name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    MobileNo: {
      type: String,
      required: [true, "Mobile number is required"],
      match: [/^\d{10,15}$/, "Mobile number must be between 10 to 15 digits"],
    }, 
    ApiUrl: {
      type: String,
      required: [true, "API URL is required"],
      match: [
        /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/,
        "Invalid URL format",
      ],
    },
    UserName: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
    },
    Password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    //  select: false, // Excludes password from query results by default
    },
    IsActive: {
      type: Boolean,
      default: false, // Default is inactive
    },
  },
  { timestamps: true, collection: "SmsSetting"}
);


const SmsSetting = mongoose.model("SmsSetting", SmsSettingSchema)

export default SmsSetting;