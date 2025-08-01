import mongoose from "mongoose";

export interface IAssessment {
    userId:mongoose.Types.ObjectId,
    assessmentName:string,
    assessmentType:string,
    submissions:{
        questionNumber:number,
        answer:string
    }[]
}