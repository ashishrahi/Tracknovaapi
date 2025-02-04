import mongoose from "mongoose";

const RouteSchema = new mongoose.Schema(
  {
    CreatedBy: { type: String, required: true, trim: true },
    Description: { type: String, trim: true },
    RouteDate: { type: Date, },
    RouteID: { type: Number, required: true, unique: true },
    RouteName: { type: String,  trim: true },
    UpdatedBy: { type: String,  trim: true },
    CreatedBy: { type: String,  trim: true },

  },
  {
    timestamps: true, // Mongoose will automatically handle `createdAt` and `updatedAt`
    collection: "Route",
  }
);

export const Route = mongoose.model("Route", RouteSchema);
