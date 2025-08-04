import express from "express";
import userAuth from "../middlewares/authMiddleware";
import {
  initiatePayment,
  paymentResponseHandling,
} from "../controllers/paymentController";

const router = express.Router();

router.post("/initiate", userAuth, initiatePayment);
router.post("/ccavenue-response", paymentResponseHandling);

export default router;
