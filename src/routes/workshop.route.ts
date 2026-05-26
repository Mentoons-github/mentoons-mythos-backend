import express from "express";
import userAuth from "../middlewares/authMiddleware";
import {
  addWorkshop,
  createWorkshopPlan,
  deleteEnquiry,
  deleteWorkshop,
  deleteWorkshopPlan,
  editWorkshopPlan,
  fetchEnquiryCount,
  fetchWorkshopCount,
  getEnquiries,
  getEnquiryById,
  getSingleWorkshop,
  getWorkshopPlans,
  getWorkshops,
  registeWorkshop,
  updateWorkshop,
} from "../controllers/workshopController";

const routes = express.Router();

routes.post("/add-new", userAuth, addWorkshop);
routes.get("/get", getWorkshops);
routes.post("/register/:workshopId", userAuth, registeWorkshop);
routes.get("/enquiries", userAuth, getEnquiries);
routes.get("/get/count", userAuth, fetchWorkshopCount);
routes.get("/:workshopId", userAuth, getSingleWorkshop);
routes.delete("/delete/:workshopId", userAuth, deleteWorkshop);
routes.put("/edit/:workshopId", userAuth, updateWorkshop);
routes.get("/enquiries/get/count", userAuth, fetchEnquiryCount);
routes.get("/enquiries/:enquiryId", userAuth, getEnquiryById);
routes.delete("/enquiries/delete/:enquiryId", userAuth, deleteEnquiry);
routes.get("/plans/get", getWorkshopPlans);
routes.post("/plans/new", userAuth, createWorkshopPlan);
routes.delete("/plan/delete/:planId", userAuth, deleteWorkshopPlan);
routes.patch("/plan/edit/:planId",userAuth, editWorkshopPlan)

export default routes;
