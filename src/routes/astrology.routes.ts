import express from "express";
import userAuth from "../middlewares/authMiddleware";
import { getAstroDetails } from "../controllers/astrologyController";

const router = express.Router();

router.get("/zodiac-signs", userAuth, getAstroDetails);

export default router;
