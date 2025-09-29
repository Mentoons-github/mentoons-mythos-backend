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

export interface SubmissionsI {
  assessmentName: string;
  question: string;
  answer: string;
  optionNo: number;
  options: string[];
}

export interface InitialAssessmentI {
  userId: mongoose.Types.ObjectId;
  assessmentType: string;
  submissions: SubmissionsI[];
  intelligenceTypes: string[];
  scores?: Map<string, number>;
}
