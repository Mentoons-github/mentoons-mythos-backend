import express from "express";
import userAuth from "../middlewares/authMiddleware";
import {
  getIntelligenceGroupMembers,
  getRashiGroupMembers,
} from "../controllers/groupController";

const routes = express.Router();

routes.get("/rashi/members/:rashi", userAuth, getRashiGroupMembers);
routes.get(
  "/intelligence/members/:intelligence",
  userAuth,
  getIntelligenceGroupMembers
);

export default routes;
