import express from "express";
import {
  addComment,
  createBlog,
  fetchBlog,
  fetchSingleBlog,
  getComments,
  replyComment,
  toggleLike,
  fetchUserBlogs,
  increaseViewsCount,
  fetchBlogByViews,
} from "../controllers/blogController";
import userAuth from "../middlewares/authMiddleware";

const routes = express.Router();

routes.post("/create", userAuth, createBlog);
routes.get("/", userAuth, fetchUserBlogs);
routes.get("/get", fetchBlog);
routes.get("/get/:blogId", userAuth, fetchSingleBlog);
routes.patch("/:blogId/like", userAuth, toggleLike);
routes.post("/:blogId/comment/post-comments", userAuth, addComment);
routes.post("/comments/:commentId/reply", userAuth, replyComment);
routes.get("/:blogId/comment/get-comments", userAuth, getComments);
routes.patch('/:blogId/views', userAuth, increaseViewsCount)
routes.get("/most-read", fetchBlogByViews)





export default routes;
