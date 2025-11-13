import mongoose from "mongoose";
import { ICareerGPS } from "../interfaces/CareerGpsInterface";

interface ICareerGPSDocument extends ICareerGPS, Document {}

const creerGpsSchema = new mongoose.Schema<ICareerGPSDocument>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
    submittedBy: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const CareerGPS = mongoose.model<ICareerGPSDocument>(
  "CareerGPS",
  creerGpsSchema
);

export default CareerGPS;
