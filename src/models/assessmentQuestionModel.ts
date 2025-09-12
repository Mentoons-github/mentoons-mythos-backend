import mongoose from "mongoose";
import { IAssessmentQuestion } from "../interfaces/AssessmentInterface";

export interface IAssessmentQuestionDocument
  extends IAssessmentQuestion,
    Document {}

const assessmentQuestionSchema =
  new mongoose.Schema<IAssessmentQuestionDocument>({
    type: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    questions: [
      {
        question: {
          type: String,
          required: true,
          trim: true,
        },
        options: {
          type: [String],
          required: true,
          validate: {
            validator: function (arr: string[]) {
              return arr.length > 2;
            },
            message: "At least three options are required",
          },
        },
      },
    ],
  });

const AssessmentQuestion = mongoose.model<IAssessmentQuestionDocument>(
  "AssessmentQuestion",
  assessmentQuestionSchema
);
export default AssessmentQuestion;
