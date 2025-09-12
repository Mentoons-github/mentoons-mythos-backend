import mongoose from "mongoose";
import { IJobs } from "../interfaces/careerInterface";

export interface IJobDocuments extends IJobs, Document{}

const image =
  "https://media.istockphoto.com/id/1327592506/vector/default-avatar-photo-placeholder-icon-grey-profile-picture-business-man.jpg?s=2048x2048&w=is&k=20&c=d1b4VHqWm1Gt8V148JOvaYSnyIvsFZEpGRCxLK-hGU4=";
const jobSchema = new mongoose.Schema<IJobDocuments>(
  {
    jobTitle: {
      type: String,
      required: true,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    responsibilities: {
      type: [String],
      required:true
    },
    requirements:{
      type: [String],
      required:true
    },
    endDescription:{
      type:String,
      
    },
    skillsRequired: {
      type: [String],
      required: true,
    },
    jobLocation: {
      type: String,
      enum:["On-site", "Work from home", "Hybrid"],
      default: "On-site",
    },
    jobType: {
      type: String,
      enum: ["Full-Time", "Part-Time", "Internship", "Contract"],
      default: "Full-Time",
    },
    thumbnail: {
      type: String,
      default: image,
    },
    applications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "JobApplication",
      },
    ],
    status: {
      type: String,
      enum: ["Open", "Closed", "Pause"],
      default: "Open",
    },
  },
  { timestamps: true }
);

const Jobs = mongoose.model<IJobDocuments>("Jobs", jobSchema);
export default Jobs;
