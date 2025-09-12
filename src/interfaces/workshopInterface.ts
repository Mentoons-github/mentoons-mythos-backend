import mongoose from "mongoose";

export interface IEnquiry {
  userId: mongoose.Types.ObjectId;
  workshopId: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  message: string;
  category: string;
}

export interface IWorkshop {
  age: string;
  amount: number;
  focus: string;
  img: string;
  activities: string[];
  enquiries: mongoose.Types.ObjectId[];
}
