import express from "express";
import userAuth from "../middlewares/authMiddleware";
import {
  applyCareer,
  createJobs,
  deleteJob,
  deleteJobApplication,
  deleteSelectedJobApplications,
  fetchJobApplicationCount,
  fetchJobCount,
  getAllApplications,
  getJobById,
  getJobs,
  getSingleJobApplication,
  sendAssignements,
  updateApplicationStatus,
  updateJob,
} from "../controllers/careerController";

const routes = express.Router();

routes.post("/apply/:jobId", userAuth, applyCareer);
routes.get("/jobs", userAuth, getJobs);
routes.get("/job/:jobId", userAuth, getJobById);
routes.get("/job/get/count", userAuth, fetchJobCount);
routes.post("/job/createjob", userAuth, createJobs);
routes.put("/job/update/:jobId", userAuth, updateJob);
routes.delete("/job/delete/:jobId", userAuth, deleteJob);
routes.get("/job/get/applications", userAuth, getAllApplications);
routes.get("/job/application/count", userAuth, fetchJobApplicationCount);
routes.delete(
  "/job/application/delete/:applicationId",
  userAuth,
  deleteJobApplication
);
routes.delete(
  "/job/application/delete",
  userAuth,
  deleteSelectedJobApplications
);
routes.get(
  "/job/get/application/:applicationId",
  userAuth,
  getSingleJobApplication
);
routes.post("/job/application/assignement", userAuth, sendAssignements);
routes.patch("/job/application/status", userAuth, updateApplicationStatus);

export default routes;
