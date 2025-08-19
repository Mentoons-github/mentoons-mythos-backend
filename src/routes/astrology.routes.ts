import express from "express";
import userAuth from "../middlewares/authMiddleware";
import {
  checkRashiStatus,
  getAstroDetails,
  upsertZodiac,
  downloadReport,
} from "../controllers/astrologyController";

const router = express.Router();

router.get("/checkUserRashi", userAuth, checkRashiStatus);
router.get("/zodiac-signs", userAuth, getAstroDetails);
router.put("/update-zodiac", userAuth, upsertZodiac);
router.get("/download-report", userAuth, downloadReport);

export default router;
