import express from "express";
import {
  createBlog,
  fetchBlog,
  fetchUserBlogs,
} from "../controllers/blogController";
import userAuth from "../middlewares/authMiddleware";

const routes = express.Router();

routes.get("/", userAuth, fetchUserBlogs);
routes.post("/create", userAuth, createBlog);
routes.get("/get", userAuth, fetchBlog);

export default routes;
