import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const NodeSchema = new Schema(
  {
    NodeId: { type: Number }, 
    NodeName: { type: String, },
    ParentId: { type: String }, 
    Icon: { type: String },
    DisplayNo: { type: Number },
    Location: { type: String },
  },
  { collection: "Node", timestamps: true }
);

export const Node = model("Node", NodeSchema);
