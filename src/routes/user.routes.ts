import express from "express";
import userAuth from "../middlewares/authMiddleware";
import { fetchUser } from "../controllers/userController";

const router = express.Router();

router.get("/", userAuth, fetchUser);

export default router;
