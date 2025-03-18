import mongoose from "mongoose";

const CommGroupSchema = new mongoose.Schema({
    GroupId: mongoose.Schema.Types.Int32,
    Name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minlength: [3, 'Name must be at least 3 characters long'],
        maxlength: [50, 'Name cannot exceed 50 characters'],
        // match: [/^[a-zA-Z ]+$/, 'Name can only contain letters and spaces']
      },
    Type: String,
    Description: String,
    IsActive: Boolean,
    CreatedBy: String,
    UpdatedBy: String,
}, {timestamps: true, collection: "CommGroup"});

const CommGroup = mongoose.model("CommGroup", CommGroupSchema);

export default CommGroup;
