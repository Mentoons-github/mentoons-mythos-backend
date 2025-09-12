import mongoose from "mongoose";

export interface IAssessment {
  userId: mongoose.Types.ObjectId;
  assessmentName: string;
  assessmentType: string;
  submissions: {
    questionNumber: number;
    answer: string;
  }[];
}

export interface IAssessmentQuestion {
  type: string;
  name: string;
  questions: {
    question: string;
    options: string[];
  }[];
}
