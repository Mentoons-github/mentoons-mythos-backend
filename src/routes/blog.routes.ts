import express from "express";
import userAuth from "../middlewares/authMiddleware";
import {
  addComment,
  createBlog,
  fetchBlog,
  getComments,
  toggleLike,
  fetchUserBlogs,
} from "../controllers/blogController";

const routes = express.Router();

routes.get("/", userAuth, fetchUserBlogs);
routes.post("/create", userAuth, createBlog);
routes.get("/get", userAuth, fetchBlog);
routes.patch("/:blogId/like", userAuth, toggleLike);
routes.post("/:blogId/comment/post-comments", userAuth, addComment);
routes.get("/:blogId/comment/get-comments", userAuth, getComments);

export default routes;
