import mongoose from "mongoose";
import { IMentor } from "../interfaces/careerInterface";

interface IMentorDocument extends IMentor, Document {}
const mentorSchema = new mongoose.Schema<IMentorDocument>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mentorType: {
      type: String,
      required: true,
    },
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
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: Number,
      required: true,
    },
    whatsappNumber: {
      type: Number,
      required: true,
    },
    resume: {
      type: String,
      required: true,
    },
    socialLinks: {
      type: [String],
      required: true,
    },
    status: {
      type: String,
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Mentor = mongoose.model<IMentorDocument>("Mentor", mentorSchema);
export default Mentor;
