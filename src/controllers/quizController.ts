import catchAsync from "../utils/cathAsync";
import * as quizServices from "../services/quizServices";

//creat quiz
export const createNewQuiz = catchAsync(async (req, res) => {
  const quizData = req.body;
  const quiz = await quizServices.createNewQuiz(quizData);
  res.status(201).json({ message: "New quiz added", quiz });
});

//get all quiz
export const getAllQuizes = catchAsync(async (req, res) => {
  const quizes = await quizServices.getAllQuizes();
  res.status(200).json({ message: "All quizes fetched", quizes });
});

//get single quiz
export const getSingleQuiz = catchAsync(async (req, res) => {
  const { category } = req.params;
  const quiz = await quizServices.getSingleQuiz(category);
  res.status(200).json({ message: "Fetched single quiz", quiz });
});

//delete quiz
export const deleteQuiz = catchAsync(async (req, res) => {
  const { quizId } = req.params;
  await quizServices.deleteQuiz(quizId);
  res.status(200).json({ message: "Quiz successfully deleted" });
});

//edit quiz
export const editQuiz = catchAsync(async (req, res) => {
  const { quizId } = req.params;
  const quizData = req.body;
  await quizServices.editQuiz(quizId, quizData);
  res.status(200).json({ message: "Quiz successfully updated" });
});
