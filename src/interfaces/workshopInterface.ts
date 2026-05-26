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

export interface IWorkshopPlan {
  title: string;
  months: string;
  duration: string;
  price: string;
  highlight: boolean;
  totalSessions: string;
  ageGroups: string[];
  features: string[];
  materials: string[];
  mode: string[];
}
