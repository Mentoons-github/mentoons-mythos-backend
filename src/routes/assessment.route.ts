import express from "express";
import userAuth from "../middlewares/authMiddleware";
import {
  assessmentSubmission,
  createAssessment,
  deleteAssessmentSubmission,
  deleteInitialAssessmentSubmission,
  getAllAssessments,
  getAssessmentQuestion,
  getFirstAssessmentQuestions,
  getInitialAssessmentSubmissions,
  getSingleInitialAssessmentDetails,
  getSingleSubmission,
  initialSubmission,
} from "../controllers/assessmentController";

const routes = express.Router();

routes.post("/submit", userAuth, assessmentSubmission);
routes.post("/new-question", userAuth, createAssessment);
routes.get("/fetch/:name", userAuth, getAssessmentQuestion);
routes.get("/getall", userAuth, getAllAssessments);
routes.get("/getSingle/:submissionId", userAuth, getSingleSubmission);
routes.get("/initial", userAuth, getFirstAssessmentQuestions);
routes.post("/initial/submit/:userId", userAuth, initialSubmission);
routes.get("/initial/details", userAuth, getInitialAssessmentSubmissions);
routes.get(
  "/initial/details/:assessmentId",
  userAuth,
  getSingleInitialAssessmentDetails
);
routes.delete("/delete/:assessmentId", userAuth, deleteAssessmentSubmission);
routes.delete(
  "/initial/delete/:assessmentId",
  userAuth,
  deleteInitialAssessmentSubmission
);

export default routes;
