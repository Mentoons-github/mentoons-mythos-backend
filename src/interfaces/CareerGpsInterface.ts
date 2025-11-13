import mongoose from "mongoose";

export interface ICareerGPS {
  userId: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: number;
  whatsappNumber: number;
  age: number;
  gender: string;
  submittedBy:string
}
