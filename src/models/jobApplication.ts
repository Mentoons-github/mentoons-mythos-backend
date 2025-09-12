import mongoose from "mongoose";
import { ICareer } from "../interfaces/careerInterface";

export interface ICareerDocument extends ICareer, Document{}

const jobApplicationSchema = new mongoose.Schema<ICareerDocument>({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email']
    },
    mobileNumber: {
        type: Number,
        required: [true, 'Please add a phone number']
    },
    // portfolioLink: {
    //     type: String,
    //     required: [true, 'Please add a Portfolio Link']
    // },
    coverNote: {
        type: String,
        // required: [true, 'Please add a cover note']
    },
    position: {
        type:String,
        required:true
    },
    gender: {
        type:String,
        required:true,
        enum:["Male", "Female", "Other", "Prefer not to say"]
    },
    status: {
        type:String,
        default:"Pending",
        enum:["Shortlisted", "Pending", "Rejected"]
    },
    cLocation: {
        type:String,
        required:true
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: [true, 'Please add a job id']
    },
    resume: {
        type: String,
        required: [true, 'Please add a resume']
    },
}, { timestamps: true });

const JobApplication = mongoose.model<ICareerDocument>("JobApplication",jobApplicationSchema)
export default JobApplication