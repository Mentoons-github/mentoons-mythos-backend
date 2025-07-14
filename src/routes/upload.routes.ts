import express from "express";
import userAuth from "../middlewares/authMiddleware";
import { fileUpload } from "../controllers/uploadController";

const router = express.Router();

router.post("/file",userAuth, fileUpload);

export default router;
