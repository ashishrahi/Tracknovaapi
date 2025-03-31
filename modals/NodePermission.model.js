import mongoose from "mongoose";

export const NodePermissionSchema = new mongoose.Schema({
    ID: {
        type: Number,
        required: true,
        unique: true
    },
    UserId: {
        type:  String,
        required: true,
        // unique: true
    },
    NodeId: {
        type: Number,
    },
    ParentId :{
        type: Number,
    },
    UserName: {
        type: String
    },
    NodeName: {
        type: String
    }
}, {timestamps: true, collection: "NodePermission"})

const NodePermission = mongoose.model("NodePermission", NodePermissionSchema);

export default NodePermission;