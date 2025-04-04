import mongoose from "mongoose";
import argon2 from "argon2";

export const Idp_accountSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters long"],
    // validate: {
    //   validator: function (value) {
    //     return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\W]{8,}$/.test(value);
    //   },
    //   message: (value) => (value ,"must be at least 8 characters long and contain at least one letter and one number")
    // },
  },
  accountOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  users: [
    {
      username: { type: String, required: true, lowercase: true },
      password: { type: String, required: true },
      email: { type: String, required: true },
      role: { type: String, required: true },
      // dbName: {type: String, required: true}
    }
  ]
})

Idp_accountSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      const hashedPassword = await argon2.hash(this.password);
      this.password = hashedPassword;
    }
    next()
  } catch (error) {
    next(error);
  }
})

Idp_accountSchema.methods.isValidPassword = async function (plainTextPassword) {
  try {
    const isValid = await argon2.verify(this.password, plainTextPassword);
    return isValid;
  } catch (error) {
    console.error("Error verifying password:", error);
    return false; // Return false if verification fails
  }
}

Idp_accountSchema.methods.isValidPasswordForUsers = async function ( username, plainTextPassword) {
  try {
    // console.table({plainTextPassword, username})
    // Find the user inside the 'users' array
    const user = this.users.find(user => user.username === username);
    // console.log("User from mongoose middleware", user)
    if (!user) {
      console.error("User not found.");
      return false;
    }
  
    const isValid = await argon2.verify(user.password, plainTextPassword);
    return isValid;
  } catch (error) {
    console.error("Error verifying password:", error);
    return false; // Return false if verification fails
  }
}




const Idp_account = mongoose.model("Idp_account", Idp_accountSchema);

export default Idp_account;