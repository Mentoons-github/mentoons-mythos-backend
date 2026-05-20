import mongoose from "mongoose";
import { IQuiz, IQuizQuestions } from "../interfaces/quizeInterface";

export interface IQuizDocument extends IQuiz, Document {}

const quizQuestionSchema = new mongoose.Schema<IQuizQuestions>({
  question: String,
  options: [String],
  answer: String,
});

const quizSchema = new mongoose.Schema<IQuizDocument>(
  {
    category: {
      type: String,
      required: true,
    },
    questions: [quizQuestionSchema],
  },
  { timestamps: true },
);

const Quiz = mongoose.model<IQuizDocument>("Quiz", quizSchema);
export default Quiz;
