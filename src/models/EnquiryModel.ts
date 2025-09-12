import mongoose from "mongoose";
import { IEnquiry } from "../interfaces/workshopInterface";

export interface IEnquiryDocument extends IEnquiry, Document {}

const EnquirySchema = new mongoose.Schema<IEnquiryDocument>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    workshopId:{
      type: mongoose.Schema.Types.ObjectId,
      ref:"Workshop"
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: false,
    },
    category: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Enquiry = mongoose.model<IEnquiryDocument>("Enquiry", EnquirySchema);
export default Enquiry;
