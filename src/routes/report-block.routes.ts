import express from "express";
import userAuth from "../middlewares/authMiddleware";
import {
  allBlockedDeatails,
  blockUser,
  deleteReports,
  fetchReports,
  fetchSingleReports,
  takeReportAction,
} from "../controllers/report-blockController";

const routes = express.Router();

routes.get("/reports", userAuth, fetchReports);
routes.get("/reports/:reportId", userAuth, fetchSingleReports);
routes.delete("/reports/:reportId", userAuth, deleteReports);
routes.patch("/reports/action/:reportId", userAuth, takeReportAction);
routes.post("/block", userAuth, blockUser);
routes.get("/block/all", userAuth, allBlockedDeatails);

export default routes;
