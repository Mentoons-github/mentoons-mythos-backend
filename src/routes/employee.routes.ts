import express from "express";
import { employeeLogin } from "../controllers/employee/auth";

const router = express.Router();

router.post("/login", employeeLogin);

export default router;
