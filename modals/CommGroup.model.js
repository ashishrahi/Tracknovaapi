import mongoose from "mongoose";

const CommGroupSchema = new mongoose.Schema({
    CreatedBy: String,
    Description: String,
    GroupId: mongoose.Schema.Types.Int32,
    IsActive: Boolean,
    Name: String,
    Type: String,
    UpdatedBy: String,
}, {timestamps: true, collection: "CommGroup"});

const CommGroup = mongoose.model("CommGroup", CommGroupSchema);

export default CommGroup;
