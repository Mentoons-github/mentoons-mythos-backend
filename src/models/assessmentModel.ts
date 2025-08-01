import mongoose from "mongoose";
import { IAssessment } from "../interfaces/AssessmentInterface";

export interface IAssessmentDocument extends IAssessment, Document {}

const assessmentSchema = new mongoose.Schema<IAssessmentDocument>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  assessmentName: {
    type: String,
    required: true,
  },
  assessmentType: {
    type: String,
    required: true,
  },
  submissions: [
  {
    questionNumber: { type: Number, required: true },
    answer: { type: String, required: true },
  },
],


},{timestamps:true});

const Assessment = mongoose.model<IAssessmentDocument>('Assessment', assessmentSchema)

export default Assessment