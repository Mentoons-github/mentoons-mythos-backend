import express from "express";
import userAuth from "../middlewares/authMiddleware";
import {
  addCommentV2,
  commentOffToggle,
  createBlogV2,
  deleteBlogV2,
  deleteCommentV2,
  editCommentV2,
  fetchBlogV2,
  fetchSingleBlogV2,
  fetchUserBlogsV2,
  getCommentsV2,
  getReplyCommentsV2,
  replyCommentV2,
  saveBlogV2,
  takeBlogActions,
  toggleLikeV2,
  userSavedBlogsV2,
} from "../controllers/blogV2Controller";
import { optionalAuth } from "../middlewares/optionalAuthMiddleware";

const routes = express.Router();

routes.post("/create", userAuth, createBlogV2);
routes.get("/get", optionalAuth, fetchBlogV2);
routes.get("/admin/get", userAuth, fetchBlogV2);
routes.get("/get/:blogId", userAuth, fetchSingleBlogV2);
routes.patch("/:blogId/like", userAuth, toggleLikeV2);
routes.post("/:blogId/comment/post-comments", userAuth, addCommentV2);
routes.get("/:blogId/comment/get-comments", userAuth, getCommentsV2);
routes.get("/:commentId/reply/get-reply", userAuth, getReplyCommentsV2);
routes.post("/comments/:commentId/reply", userAuth, replyCommentV2);
routes.delete("/delete/:blogId", userAuth, deleteBlogV2);
routes.delete("/comment/delete/:commentId", userAuth, deleteCommentV2);
routes.patch("/comment/edit/:commentId", userAuth, editCommentV2);
routes.patch("/commentoffToggle/:blogId", userAuth, commentOffToggle);
routes.get("/user", userAuth, fetchUserBlogsV2);
routes.patch("/save/:blogId", userAuth, saveBlogV2);
routes.get("/user/saved", userAuth, userSavedBlogsV2);
routes.patch("/takeAction", userAuth, takeBlogActions);

export default routes;
