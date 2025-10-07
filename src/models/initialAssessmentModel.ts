import mongoose from "mongoose";
import { InitialAssessmentI } from "../interfaces/AssessmentInterface";

interface IAssessmentDocument extends InitialAssessmentI, Document {}

const initialAssessmentSchema = new mongoose.Schema<IAssessmentDocument>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    assessmentType: {
      type: String,
      required: true,
    },
    submissions: [
      {
        assessmentName: { type: String, required: true },
        question: { type: String, required: true },
        answer: { type: String, required: true },
        options: { type: [String] },
        optionNo: { type: Number, required: true },
      },
    ],
    intelligenceTypes: { type: [String] },
    scores: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  { timestamps: true }
);

const InitialAssessment = mongoose.model<IAssessmentDocument>(
  "InitialAssessment",
  initialAssessmentSchema
);

export default InitialAssessment;
