import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { ApiErrorResponse } from "../utils/apiResponse/index.js";
import { StatusCodes } from "http-status-codes";

const AspNetUsersSchema = new mongoose.Schema( {
    Id: {
      type: String,
      default: null,
      // default: () => crypto.randomUUID(), // Generates UUID by default
    },
    UserName: {
      type: String,
      required: true,
      trim: true,
      unique: true, // Ensures unique usernames
    },
    NormalizedUserName: {
      type: String,
      // required: true,
      trim: true,
      uppercase: true, // Ensures consistency
    },
    Email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"], // Basic email validation
    },
    NormalizedEmail: {
      type: String,
      // required: true,
      trim: true,
    },
    EmailConfirmed: {
      type: Boolean,
      default: false,
    },
    PasswordHash: {
      type: String,
      required: true,
    },
    SecurityStamp: { // Access Token
      type: String,
      // required: true,
    },
    ConcurrencyStamp: {
      type: String,
      // required: true,
      default: null
    },
    PhoneNumber: {
      type: String,
      default: null,
      match: [/^\d{10}$/, "Phone number must be 10 digits"], // Ensures only valid numbers
    },
    PhoneNumberConfirmed: {
      type: Boolean,
      default: false,
    },
    TwoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    LockoutEnd: {
      type: Date,
      default: null,
    },
    LockoutEnabled: {
      type: Boolean,
      default: true,
    },
    AccessFailedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },{timestamps: true, collection: "AspNetUsers"});

// Pre-save middleware to automatically set NormalizedEmail
AspNetUsersSchema.pre('save', async function (next) {
    try {
      // For first time or when update then
      if (this.isModified('Email') || this.isNew) {
        this.NormalizedEmail = this.Email.toUpperCase(); // Convert Email to uppercase
      }
      if (this.isModified('UserName') || this.isNew) {
        this.NormalizedUserName = this.UserName.toUpperCase(); // Convert Email to uppercase
      }
      // generating hashed password
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(this.PasswordHash, salt);
      this.PasswordHash = hashedPassword;

      next();
    } catch (error) {
      throw new ApiErrorResponse(StatusCodes.BAD_REQUEST,error.message);
    }
});

AspNetUsersSchema.methods.isValidPassword = async function (password){
  const isValid = await bcrypt.compare(password, this.PasswordHash)
  return isValid;
} 

AspNetUsersSchema.methods.generateAccessToken =  function (){
  const payload = {
    Id: this.Id,
    UserName: this.UserName,
    Email: this.Email
  }
  const secret = process.env.ACCESS_TOKEN_SECRET;
  const option = {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    issuer: process.env.JWTOKEN_ISSUER_NAME
  }
  const token = jwt.sign(payload, secret, option);
  return token;
}

AspNetUsersSchema.methods.generateRefreshToken =  function (){
  const payload = {
    Id: this.Id
  }
  const secret = process.env.REFRESH_TOKEN_SECRET;
  const option = {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    issuer: process.env.JWTOKEN_ISSUER_NAME
  }
  const token = jwt.sign(payload, secret, option);
  return token;
}


const AspNetUsers = mongoose.model("AspNetUsers", AspNetUsersSchema);

export default AspNetUsers;