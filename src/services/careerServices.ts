import mongoose from "mongoose";
import { ICareer, IJobs } from "../interfaces/careerInterface";
import JobApplication from "../models/jobApplication";
import Jobs from "../models/JobModel";
import CustomError from "../utils/customError";
import { ApplyJobMail, sendAssignments } from "../utils/bookCallMail";

interface FilterParams {
  page: number;
  limit: number;
  genders?: string[];
  jobTitles?: string[];
  locations?: string[];
  status?: string[];
  sort: string;
  search?: string;
}

//apply for job
export const applyCareer = async (datas: ICareer, jobId: string) => {
  console.log(datas);
  const {
    name,
    email,
    mobileNumber,
    resume,
    position,
    cLocation,
    coverNote,
    gender,
  } = datas;

  const alreadyApplied = await JobApplication.findOne({ email, position });
  if (alreadyApplied) {
    throw new CustomError("You already applied for this job", 400);
  }

  const application = await JobApplication.create({
    jobId: new mongoose.Types.ObjectId(jobId),
    name,
    email,
    mobileNumber,
    resume,
    position,
    cLocation,
    coverNote,
    gender,
  });

  await Jobs.findByIdAndUpdate(jobId, {
    $push: { applications: application._id },
  });
  await ApplyJobMail(datas);
  return application;
};

//get all jobs
export const getJobs = async (
  page: number,
  limit: number,
  sort: "newest" | "oldest" = "newest",
  search?: string
) => {
  const skip = (page - 1) * limit;
  const query: any = {};

  if (search) {
    query.$or = [
      { jobTitle: { $regex: search, $options: "i" } },
      { skillsRequired: { $regex: search, $options: "i" } },
    ];
  }
  const sortOrder = sort === "newest" ? -1 : 1;
  const jobs = await Jobs.find(query)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: sortOrder });

  const total = await Jobs.countDocuments(query);
  if (!jobs) throw new CustomError("No jobs find", 404);
  return {
    jobs,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

//fetch job count
export const fetchJobCount = async () => {
  const jobs = await Jobs.find();
  return jobs.length;
};

//get single job
export const getJobById = async (jobId: string) => {
  if (!jobId) throw new CustomError("Failed to verify job id", 400);
  const job = await Jobs.findById(jobId);
  return job;
};

//create job
export const createJobs = async (datas: IJobs) => {
  const {
    jobTitle,
    jobDescription,
    jobLocation,
    jobType,
    skillsRequired,
    status,
    thumbnail,
    requirements,
    responsibilities,
    endDescription,
  } = datas;
  const job = await Jobs.create({
    jobTitle,
    jobDescription,
    jobLocation,
    jobType,
    skillsRequired,
    status,
    thumbnail,
    responsibilities,
    requirements,
    endDescription,
  });
  return job;
};

//update job
export const updateJob = async (data: IJobs, jobId: string) => {
  const {
    jobTitle,
    jobDescription,
    jobLocation,
    jobType,
    skillsRequired,
    status,
    thumbnail,
    requirements,
    responsibilities,
    endDescription,
  } = data;

  const updatedJob = await Jobs.findByIdAndUpdate(
    jobId,
    {
      jobTitle,
      jobDescription,
      jobLocation,
      jobType,
      skillsRequired,
      status,
      thumbnail,
      requirements,
      responsibilities,
      endDescription,
    },
    { new: true, runValidators: true }
  );

  if (!updatedJob) throw new CustomError("Job not found", 404);

  return updatedJob;
};

//delete job
export const deleteJob = async (jobId: string) => {
  const deletedJob = await Jobs.findByIdAndDelete(jobId);
  if (!deletedJob) throw new CustomError("Job not found", 404);
  return deletedJob;
};

//get all applications
export const getAllApplications = async ({
  page,
  limit,
  genders,
  jobTitles,
  locations,
  status,
  sort,
  search,
}: FilterParams) => {
  const skip = (page - 1) * limit;

  const query: any = {};

  if (genders && genders.length > 0) {
    query.gender = { $in: genders };
  }

  if (jobTitles && jobTitles.length > 0) {
    query.position = { $in: jobTitles };
  }

  if (locations && locations.length > 0) {
    query.cLocation = { $in: locations };
  }

  if (status && status.length > 0) {
    query.status = { $in: status };
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { position: { $regex: search, $options: "i" } },
    ];
  }
  const sortOrder = sort === "newest" ? -1 : 1;

  const applications = await JobApplication.find(query)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: sortOrder });

  const total = await JobApplication.countDocuments(query);

  return {
    applications,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

//fetch application count
export const fetchJobApplicationCount = async () => {
  const applications = await JobApplication.find();
  return applications.length;
};

//delete application
export const deleteJobApplication = async (applicationId: string) => {
  const application = await JobApplication.findById(applicationId);
  if (!application) throw new CustomError("Job not found", 404);
  await JobApplication.findByIdAndDelete(applicationId);
  await Jobs.findByIdAndUpdate(application.jobId, {
    $pull: { applications: application._id },
  });

  return application;
};

//delete multiple application
export const deleteSelectedJobApplications = async (
  applicationIds: string[]
) => {
  const applications = await JobApplication.find({
    _id: { $in: applicationIds },
  });
  if (!applications || applications.length === 0) {
    throw new CustomError("No applications found", 404);
  }

  const jobUpdates = applications.reduce(
    (acc: Record<string, mongoose.Types.ObjectId[]>, app) => {
      const jobIdStr = app.jobId.toString();
      if (!acc[jobIdStr]) acc[jobIdStr] = [];
      acc[jobIdStr].push(app._id);
      return acc;
    },
    {}
  );

  await JobApplication.deleteMany({ _id: { $in: applicationIds } });
  const jobUpdatePromises = Object.entries(jobUpdates).map(([jobId, appIds]) =>
    Jobs.findByIdAndUpdate(jobId, {
      $pull: { applications: { $in: appIds } },
    })
  );
  await Promise.all(jobUpdatePromises);
  return { deletedCount: applicationIds.length };
};

//get single application
export const getSingleJobApplication = async (applicationId: string) => {
  const application = await JobApplication.findById(applicationId);
  if (!application) throw new CustomError("Cannot find the application", 400);
  return application;
};

//send assignement
export const sendAssignements = async ({
  appDetails,
  jobTitle,
  dueDate,
  dueTime,
  fileUrl,
  link,
}: {
  appDetails: ICareer[];
  jobTitle: string;
  dueDate: string;
  dueTime: string;
  fileUrl: string;
  link: string;
}) => {
  await sendAssignments({
    appDetails,
    jobTitle,
    dueDate,
    dueTime,
    fileUrl,
    link,
  });
};

export const updateApplicationStatus = async (
  applicationIds: string[],
  status: string
) => {
  if (
    !applicationIds ||
    !Array.isArray(applicationIds) ||
    applicationIds.length === 0
  ) {
    throw new CustomError("applicationIds are required", 400);
  }

  if (!["Shortlisted", "Rejected"].includes(status)) {
    throw new CustomError("Invalid status", 400);
  }

  const result = await JobApplication.updateMany(
    { _id: { $in: applicationIds } },
    { $set: { status } }
  );

  return result;
};
