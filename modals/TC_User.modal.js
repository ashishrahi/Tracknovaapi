import mongoose from "mongoose";


const tc_usersSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    hashedpassword: { type: String, required: true },
    salt: { type: String, required: true },
    readonly: { type: Boolean, default: false },
    administrator: { type: Boolean, default: false },
    map: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    zoom: { type: Number, default: 1 },
    twelvehourformat: { type: Boolean, default: false },
    attributes: { type: String },
    coordinateformat: { type: String },
    disabled: { type: Boolean, default: false },
    expirationtime: { type: Date },
    devicelimit: { type: Number, default: 1 },
    userlimit: { type: Number, default: 1 },
    devicereadonly: { type: Boolean, default: false },
    phone: { type: String },
    limitcommands: { type: Boolean, default: false },
    login: { type: String },
    poilayer: { type: String },
    disablereports: { type: Boolean, default: false },
    fixedemail: { type: Boolean, default: false }
  },
  {
    collection: "tc_users",
    timestamps: true, 
  }
);

export const tc_users = model("tc_users", tc_usersSchema);
