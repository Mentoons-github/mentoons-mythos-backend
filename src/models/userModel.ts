import mongoose from "mongoose";
import { IUser } from "../interfaces/userInterface";

export interface IUserDocument extends IUser, Document {}

const userSchema = new mongoose.Schema({
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
});
const User = mongoose.model<IUserDocument>("User", userSchema);

export default User;
