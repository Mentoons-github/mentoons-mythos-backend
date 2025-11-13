import { IMentor } from "../interfaces/careerInterface";
import Mentor from "../models/BecomeMentorModel";
import { ApplyJobMail } from "../utils/bookCallMail";
import CustomError from "../utils/customError";

export const submitMentorForm = async (userId: string, form: IMentor) => {
  const alreadyApplied = await Mentor.findOne({
    email: form.email,
    mentorType: form.mentorType,
  });
  if (alreadyApplied) {
    throw new CustomError("You already applied for this job", 400);
  }
  const submittedDetails = await Mentor.create({
    userId,
    firstName: form.firstName,
    lastName: form.lastName,
    email: form.email,
    age: form.age,
    gender: form.gender,
    mobileNumber: form.mobileNumber,
    whatsappNumber: form.whatsappNumber,
    resume: form.resume,
    socialLinks: form.socialLinks,
    mentorType: form.mentorType,
  });

  ApplyJobMail({
    name: `${form.firstName} ${form.lastName}`,
    email: form.email,
    mobileNumber: form.mobileNumber,
    position: form.mentorType,
  });

  return submittedDetails;
};
