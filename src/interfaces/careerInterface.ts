import mongoose from "mongoose";

export interface ICareer {
  name: string;
  email: string;
  mobileNumber: number;
  resume: string;
  position: string;
  coverNote: string;
  cLocation: string;
  gender: string;
  status: string;
  jobId: mongoose.Types.ObjectId;
}

export interface IJobs {
  jobTitle: string;
  jobDescription: string;
  responsibilities: string[];
  requirements: string[];
  endDescription: string;
  skillsRequired: string[];
  jobLocation: string;
  jobType: string;
  thumbnail: string;
  applications: mongoose.Types.ObjectId[];
  status: string;
}

export interface IMentor {
  userId: mongoose.Types.ObjectId;
  mentorType: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: number;
  whatsappNumber: number;
  resume: string;
  age: number;
  gender: string;
  status: string;
  socialLinks: string[];
}
