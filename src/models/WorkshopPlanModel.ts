import mongoose from "mongoose";
import { IWorkshopPlan } from "../interfaces/workshopInterface";

interface IWorkshopPlanDocument extends IWorkshopPlan, Document {}

const workshopPlanSchema = new mongoose.Schema<IWorkshopPlanDocument>(
  {
    title: { type: String },
    months: { type: String },
    duration: { type: String },
    price: { type: String },
    totalSessions: { type: String },
    ageGroups: [{ type: String }],
    mode: [{ type: String }],
    features: [{ type: String }],
    materials: [{ type: String }],
    highlight: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const WorkshopPlan = mongoose.model<IWorkshopPlanDocument>(
  "WorkshopPlan",
  workshopPlanSchema,
);
export default WorkshopPlan;
