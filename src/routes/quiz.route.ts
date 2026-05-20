import express from "express";
import {
  createNewQuiz,
  deleteQuiz,
  editQuiz,
  getAllQuizes,
  getSingleQuiz,
} from "../controllers/quizController";
import userAuth from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", getAllQuizes);
router.get("/:category", getSingleQuiz);
router.post("/create", userAuth, createNewQuiz);
router.delete("/delete/:quizId", userAuth, deleteQuiz);
router.patch("/update/:quizId", userAuth, editQuiz);

export default router;
