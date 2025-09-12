import express from "express";
import userAuth from "../middlewares/authMiddleware";
import {
  addWorkshop,
  deleteEnquiry,
  deleteWorkshop,
  fetchEnquiryCount,
  fetchWorkshopCount,
  getEnquiries,
  getEnquiryById,
  getSingleWorkshop,
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

export default routes;
