import mongoose from "mongoose";

export const CommMembersSchema = new mongoose.Schema({
    Id: mongoose.Schema.Types.Int32,
    GroupId: mongoose.Schema.Types.Int32,
    MemberId: mongoose.Schema.Types.Int32,
    MemberType: String,
    EmailId: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true,
        validate: {
          validator: function (value) {
            return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
          },
          message: 'Invalid email format',
        },
      },
    PhoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        validate: {
          validator: function (value) {
            return /^[0-9]{10}$/.test(value); // Validates a 10-digit phone number
          },
          message: 'Invalid phone number. It must be a 10-digit number.',
        },
      },
    CreatedBy: String,
    UpdatedBy: String
}, {timestamps: true, collection: "CommMembers"});

const CommMembers = mongoose.model("CommMembers", CommMembersSchema);

export default CommMembers;