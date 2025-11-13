import { ICareerGPS } from "../interfaces/CareerGpsInterface";
import CareerGPS from "../models/CareerGpsModel";
import { CareerGPSMail } from "../utils/bookCallMail";
import CustomError from "../utils/customError";

export const submitCareerGps = async (userId: string, details: ICareerGPS) => {
  const alreadySubmitted = await CareerGPS.findOne({
    email: details.email,
  });
  if (alreadySubmitted) {
    throw new CustomError("You already submitted your details", 400);
  }
  const careerGpsDetails = await CareerGPS.create({
    userId,
    firstName: details.firstName,
    lastName: details.lastName,
    email: details.email,
    mobileNumber: details.mobileNumber,
    whatsappNumber: details.whatsappNumber,
    gender: details.gender,
    age: details.age,
    submittedBy: details.submittedBy,
  });

  CareerGPSMail({
    name: `${details.firstName} ${details.lastName}`,
    email: details.email,
    mobileNumber: details.mobileNumber,
  });

  return careerGpsDetails;
};
