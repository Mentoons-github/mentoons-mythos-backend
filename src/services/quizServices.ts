import { IQuiz } from "../interfaces/quizeInterface";
import Quiz from "../models/quizModel";
import CustomError from "../utils/customError";

//create new quiz
export const createNewQuiz = async (newQuiz: IQuiz) => {
  const quiz = await Quiz.create({
    category: newQuiz.category,
    questions: newQuiz.questions,
  });
  return quiz;
};

//get all quiz
export const getAllQuizes = async () => {
  const quizes = await Quiz.find();
  return quizes;
};

//get single quiz
export const getSingleQuiz = async (category: string) => {
  const quiz = await Quiz.findOne({ category });
  if (!quiz) {
    throw new CustomError("Category not found", 400);
  }
  return quiz;
};

//delete Quiz
export const deleteQuiz = async (quizId: string) => {
  const quiz = await Quiz.findByIdAndDelete(quizId);
  if (!quiz) throw new CustomError("Quiz not found", 400);
};

//edit quiz
export const editQuiz = async (quizId: string, quizData: IQuiz) => {
  const editedQuiz = await Quiz.findByIdAndUpdate(
    quizId,
    {
      category: quizData.category,
      questions: quizData.questions,
    },
    { new: true },
  );

  if (!editedQuiz) {
    throw new CustomError("Quiz not found", 400);
  }
};
