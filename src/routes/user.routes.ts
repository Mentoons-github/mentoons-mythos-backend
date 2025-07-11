import express from "express";
import userAuth from "../middlewares/authMiddleware";
import { fetchUser, updateUser } from "../controllers/userController";

const router = express.Router();

router.get("/", userAuth, fetchUser);
router.post("/update-profile", userAuth, updateUser);

export default router;
