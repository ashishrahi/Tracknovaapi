import mongoose from "mongoose";
import argon2 from "argon2";
import bcrypt from "bcryptjs";
import { findEmbeddedUserBySignInName } from "../utils/tenantLogin.js";

/**
 * Passwords in DB may be Argon2 (older path), bcrypt (current), or legacy plaintext.
 */
export async function verifyStoredPassword(stored, plain) {
  if (typeof stored !== "string" || typeof plain !== "string") {
    return false;
  }
  if (plain.length === 0) return false;
  if (stored.startsWith("$argon2")) {
    try {
      return await argon2.verify(stored, plain);
    } catch {
      return false;
    }
  }
  if (
    stored.length === 60 &&
    (stored.startsWith("$2a$") || stored.startsWith("$2b$") || stored.startsWith("$2y$"))
  ) {
    return bcrypt.compareSync(plain, stored);
  }
  return stored === plain;
}

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
      // ResetToken for Forgort Password
      resetToken:{ type:String , default: null},
      //  The Token Expire of above Token
      tokenExpires: {type:Date, default: null},
    },
  ],
});

/**
 * One login name per tenant (accountOwner): use case-insensitive collation in queries
 * (see utils/tenantLogin.js — same locale/strength as this index).
 */
Idp_accountSchema.index(
  { accountOwner: 1, "users.username": 1 },
  { unique: true, collation: { locale: "en", strength: 2 } }
);

Idp_accountSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      const hashedPassword = bcrypt.hashSync(this.password);
      this.password = hashedPassword;
    }

    // Hash passwords inside the 'users' array

    /*
    * beacuse of issues hashing the password in controller
    if (this.isModified("users")) {
      for (let user of this.users) {
        if (user.isModified && user.isModified("password")) {
          user.password = await argon2.hash(user.password);
        }
      }
    }
    */
    next();
  } catch (error) {
    next(error);
  }
});

Idp_accountSchema.methods.isValidPassword = async function (plainTextPassword) {
  try {
    return await verifyStoredPassword(this.password, plainTextPassword);
  } catch (error) {
    console.error("Error verifying password:", error);
    return false;
  }
};

Idp_accountSchema.methods.isValidPasswordForUsers = async function (
  username,
  plainTextPassword
) {
  try {
    const uname = String(username ?? "")
      .toLowerCase()
      .trim();
    const user = findEmbeddedUserBySignInName(this.users, uname);
    if (!user) {
      return false;
    }
    return await verifyStoredPassword(user.password, plainTextPassword);
  } catch (error) {
    console.error("Error verifying password:", error);
    return false;
  }
};

const Idp_account = mongoose.model("Idp_account", Idp_accountSchema);

export default Idp_account;
