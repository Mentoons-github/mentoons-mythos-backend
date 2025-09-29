import express from "express";
import {
  createAboutComment,
  deleteAboutComment,
  getAboutComments,
  getSingleAboutComment,
} from "../controllers/aboutCommentController";
import userAuth from "../middlewares/authMiddleware";

const routes = express.Router();

routes.post("/comment", createAboutComment);
routes.get("/comments", userAuth, getAboutComments);
routes.get("/comment/:commentId", userAuth, getSingleAboutComment);
routes.delete("/comment/delete/:commentId", userAuth, deleteAboutComment);

export default routes;
