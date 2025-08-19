import mongoose from "mongoose";
import { ICareer } from "../interfaces/careerInterface";

export interface ICareerDocument extends ICareer, Document{}

const careerSchema = new mongoose.Schema <ICareerDocument>(
    {
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        mobileNumber:{
            type:Number,
            required:true
        },
        resume:{
            type:String,
            required:true
        },
        position:{
            type:String,
            required:true
        }
    },{timestamps:true}
)

const Career = mongoose.model<ICareerDocument>("Career",careerSchema)
export default Career