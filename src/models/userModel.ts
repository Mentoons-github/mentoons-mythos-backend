import mongoose from "mongoose";
import { IUser } from "../interfaces/userInterface";

export interface IUserDocument extends IUser, Document {}

const astroSchema = new mongoose.Schema(
  {
    report: {
      deity: { type: String },
      ganam: { type: String },
      symbol: { type: String },
      animal_sign: { type: String },
      nadi: { type: String },
      color: { type: String },
      best_direction: { type: String },
      syllables: { type: String },
      birth_stone: { type: String },
      gender: { type: String },
      planet: { type: String },
      enemy_yoni: { type: String },
    },
    nakshatra: {
      id: { type: Number },
      name: { type: String },
      pada: { type: Number },
      lord: {
        id: { type: Number },
        name: { type: String },
        vedic_name: { type: String },
      },
    },
    zodiac: {
      type: String,
    },
    rasi: {
      id: { type: Number },
      name: { type: String },
      lord: {
        id: { type: Number },
        name: { type: String },
        vedic_name: { type: String },
      },
    },
    lastGenerated: { type: Date },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: [
        function (this: IUserDocument) {
          return !this.isGoogleUser;
        },
        "Password is required for non-Google users",
      ],
    },
    dateOfBirth: {
      type: Date,
    },
    timeOfBirth: {
      type: String,
      required: false,
    },
    country: {
      type: String,
    },
    about: {
      type: String,
    },
    isGoogleUser: {
      type: Boolean,
      default: false,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    latitude: {
      type: Number,
      required: false,
    },
    longitude: {
      type: Number,
      required: false,
    },
    astrologyDetail: {
      moonSign: {
        type: String,
      },
      sunSign: {
        type: String,
      },
    },
    astrologyReports: {
      moon: { type: astroSchema, default: null },
      sun: { type: astroSchema, default: null },
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true }
);
const User = mongoose.model<IUserDocument>("User", userSchema);

export default User;
