import mongoose from "mongoose";
import { IWorkshop } from "../interfaces/workshopInterface";

export interface IWorkshopDocument extends IWorkshop, Document {}

const workshopSchema = new mongoose.Schema<IWorkshopDocument>(
  {
    age: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    focus: {
      type: String,
      required: true,
    },
    img: {
      type: String,
    },
    activities: {
      type: [String],
      required: true,
    },
    enquiries: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "JobApplication",
      },
    ],
  },
  { timestamps: true }
);

const Workshop = mongoose.model<IWorkshopDocument>("Workshop", workshopSchema);
export default Workshop;
