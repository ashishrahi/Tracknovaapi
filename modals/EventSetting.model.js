import mongoose from "mongoose";

const EventSettingSchema = new mongoose.Schema(
  {
    EventId: {
      type: Number,
      required: true,
      unique: true,
    },
    EventName: {
      type: String,
      required: true,
      trim: true,
    },
    EventType: {
      type: String,
      required: true,
      trim: true,
    },
    SendingType: {
      type: String,
      trim: true, // Add more if needed
      // required: true,
    },
    Message: {
      type: String,
      required: true,
      trim: true,
    },
    IsActive: {
      type: Boolean,
      default: true,
      trim: true,
    },
    CreatedBy: {
      type: String,
      // required: true,
      trim: true,
    },
    UpdatedBy: {
      type: String,
      // required: true,
      trim: true,
    },
  },
  { timestamps: true, collection: "EventSetting" }
);

const EventSetting = mongoose.model("EventSetting", EventSettingSchema);

export default EventSetting;
