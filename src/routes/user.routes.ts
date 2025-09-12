import express from "express";
import userAuth from "../middlewares/authMiddleware";
import { blockUser, fetchAllUsers, fetchSingleUser, fetchUser, fetchUserCount, reportUser, updateUser } from "../controllers/userController";

const router = express.Router();

router.get("/", userAuth, fetchUser);
router.get('/all-users',userAuth,fetchAllUsers)
router.get("/count", userAuth, fetchUserCount)
router.put('/block/:userId',userAuth, blockUser)
router.put("/update-profile", userAuth, updateUser);
router.post('/report/:userId',userAuth,reportUser)
router.get('/single-user/:userId',userAuth,fetchSingleUser)

export default router;
