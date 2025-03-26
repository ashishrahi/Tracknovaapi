import mongoose from "mongoose";


const Idp_accountSchema = new mongoose.Schema({
    usename: {
        type: String,
        require: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters long"],
        validate: {
          validator: function (value) {
            return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(value);
          },
          message: (value) => `${value} must be at least 8 characters long and contain at least one letter and one number`
        },
    },
    accountOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true
    }
})

const Idp_account = mongoose.model("Idp_account", Idp_accountSchema);

export default Idp_account;