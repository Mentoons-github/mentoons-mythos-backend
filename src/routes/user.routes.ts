import express from "express";
import userAuth from "../middlewares/authMiddleware";
import { fetchUser, reportUser, updateUser } from "../controllers/userController";

const router = express.Router();

router.get("/", userAuth, fetchUser);
router.put("/update-profile", userAuth, updateUser);
router.post('/report/:userId',userAuth,reportUser)

export default router;
