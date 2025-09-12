import mongoose from "mongoose";
import { IEnquiry, IWorkshop } from "../interfaces/workshopInterface";
import Enquiry from "../models/EnquiryModel";
import Workshop from "../models/workshopModel";
import { RegisterWorkshopMail } from "../utils/bookCallMail";
import CustomError from "../utils/customError";

// add new workshop
export const addWorkshop = async (details: IWorkshop) => {
  const { age, amount, activities, focus, img } = details;
  const workshop = await Workshop.create({
    age,
    amount,
    activities,
    focus,
    img,
  });
  return workshop;
};

// get workshops
export const getWorkshops = async (
  limit: number,
  page: number,
  sort: string,
  search?: string
) => {
  const skip = (page - 1) * limit;
  const query: any = {};
  const sortOrder = sort == "newest" ? -1 : 1;
  if (search) {
    query.$or = [
      { age: { $regex: search, $options: "i" } },
      { focus: { $regex: search, $options: "i" } },
      { activities: { $regex: search, $options: "i" } },
    ];
  }
  const workshops = await Workshop.find(query)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: sortOrder });
  const total = await Workshop.countDocuments(query);
  return {
    workshops,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

// register workshop
export const registeWorkshop = async (
  details: IEnquiry,
  workshopId: string
) => {
  const {
    userId,
    firstName,
    lastName,
    mobileNumber,
    email,
    message,
    category,
  } = details;
  const alreadyRegistered = await Enquiry.findOne({ email, category });

  if (alreadyRegistered)
    throw new CustomError("You already registered for this workshop", 404);

  const application = await Enquiry.create({
    workshopId: new mongoose.Types.ObjectId(workshopId),
    userId,
    firstName,
    lastName,
    email,
    mobileNumber,
    message,
    category,
  });

  await Workshop.findByIdAndUpdate(workshopId, {
    $push: { enquiries: application._id },
  });

  await RegisterWorkshopMail(details);

  return application;
};

//get enquiries
export const getEnquiries = async (
  page: number,
  limit: number,
  sort: string,
  search?: string
) => {
  const skip = (page - 1) * limit;

  const query: any = {};

  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }
  const sortOrder = sort === "newest" ? -1 : 1;
  const enquiryDetails = await Enquiry.find(query)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: sortOrder });

  const total = await Enquiry.countDocuments();
  return {
    enquiryDetails,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

//workshop count
export const fetchWorkshopCount = async () => {
  const workshop = await Workshop.find();
  return workshop.length;
};

// get single workshop
export const getSingleWorkshop = async (workshopId: string) => {
  const workshop = await Workshop.findById(workshopId);
  if (!workshop) throw new CustomError("Workshop details not found", 400);
  return workshop;
};

// delete workshop
export const deleteWorkshop = async (workshopId: string) => {
  const deleted = await Workshop.findByIdAndDelete(workshopId);
  if (!deleted) throw new CustomError("Invalid workshop id", 400);
  return deleted;
};

//edit workshop
export const updateWorkshop = async (data: IWorkshop, workshopId: string) => {
  const updated = await Workshop.findByIdAndUpdate(
    workshopId,
    {
      age: data.age,
      amount: data.amount,
      activities: data.activities,
      focus: data.focus,
      img: data.img,
    },
    { new: true, runValidators: true }
  );

  if (!updated) throw new CustomError("Workshop not found", 400);

  return updated;
};

//enquiry count
export const fetchEnquiryCount = async () => {
  const enquiries = await Enquiry.find();
  return enquiries.length;
};

// get single enquiry
export const getEnquiryById = async (enquiryId: string) => {
  const enquiry = await Enquiry.findById(enquiryId);
  if (!enquiry) throw new CustomError("Enquiry details not found", 400);
  return enquiry;
};

// delete enquiry
export const deleteEnquiry = async (enquiryId: string) => {
  const deleted = await Enquiry.findByIdAndDelete(enquiryId);
  if (!deleted) throw new CustomError("Invalid enquiry id", 400);
  return deleted;
};
