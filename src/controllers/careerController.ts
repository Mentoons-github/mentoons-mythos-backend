import catchAsync from "../utils/cathAsync";
import * as careerServices from "../services/careerServices";

//apply for job
export const applyCareer = catchAsync(async (req, res) => {
  const jobId = req.params.jobId;
  const apply = await careerServices.applyCareer(req.body, jobId);
  res.status(201).json({ message: "You application successfully submited" });
});

//get jobs
export const getJobs = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 0;
  const sort = (req.query.sort as "newest" | "oldest") || "newest";
  const search = (req.query.search as string) || "";
  const jobs = await careerServices.getJobs(page, limit, sort, search);
  res
    .status(200)
    .json({ success: true, message: "Successfully get jobs", ...jobs });
});

//fetch job count
export const fetchJobCount = catchAsync(async (req, res) => {
  const count = await careerServices.fetchJobCount();
  res.status(200).json({ message: "Job count successfully fetched", count });
});

//get single job
export const getJobById = catchAsync(async (req, res) => {
  const job = await careerServices.getJobById(req.params.jobId);
  res
    .status(200)
    .json({ success: true, message: "Single job successfully fetched", job });
});

//create new job
export const createJobs = catchAsync(async (req, res) => {
  const newJob = await careerServices.createJobs(req.body);
  res.status(200).json({ success: true, message: "New job created", newJob });
});

//update job
export const updateJob = catchAsync(async (req, res) => {
  const updatedJob = await careerServices.updateJob(req.body, req.params.jobId);
  res
    .status(200)
    .json({ success: true, message: "Job updated successfull", updatedJob });
});

//delete job
export const deleteJob = catchAsync(async (req, res) => {
  const deletedJob = await careerServices.deleteJob(req.params.jobId);
  res
    .status(200)
    .json({ success: true, message: "Job successufully deleted", deletedJob });
});

//get all applications
export const getAllApplications = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 0;
  const genders = req.query.genders
    ? (req.query.genders as string).split(",")
    : [];
  const jobTitles = req.query.jobTitles
    ? (req.query.jobTitles as string).split(",")
    : [];
  const locations = req.query.locations
    ? (req.query.locations as string).split(",")
    : [];
  const status = req.query.status
    ? (req.query.status as string).split(",")
    : [];
  const sort = (req.query.sort as "newest" | "oldest") || "newest";
  const search = (req.query.search as string) || "";

  const data = await careerServices.getAllApplications({
    page,
    limit,
    genders,
    jobTitles,
    locations,
    status,
    sort,
    search,
  });

  res.status(200).json({
    message: "Fetched all job applications",
    success: true,
    ...data,
  });
});

//fetch application count
export const fetchJobApplicationCount = catchAsync(async (req, res) => {
  const count = await careerServices.fetchJobApplicationCount();
  res
    .status(200)
    .json({ message: "Application count successfully fetched", count });
});

export const deleteJobApplication = catchAsync(async (req, res) => {
  const deletedApplication = await careerServices.deleteJobApplication(
    req.params.applicationId
  );
  res.status(200).json({
    success: true,
    message: "Job application successufully deleted",
    deletedApplication,
  });
});

export const deleteSelectedJobApplications = catchAsync(async (req, res) => {
  const { applicationIds } = req.body;
  const deletedApplication = await careerServices.deleteSelectedJobApplications(
    applicationIds
  );
  res.status(200).json({
    success: true,
    message: `${deletedApplication.deletedCount} applications deleted successfully`,
    deletedApplication,
  });
});

export const getSingleJobApplication = catchAsync(async (req, res) => {
  const singleApplication = await careerServices.getSingleJobApplication(
    req.params.applicationId
  );
  res.status(200).json({
    success: true,
    message: "Fetched single job application",
    singleApplication,
  });
});

//assignment send to candidates
export const sendAssignements = catchAsync(async (req, res) => {
  const send = await careerServices.sendAssignements(req.body);
  res.status(200).json({
    success: true,
    message: "Assignement successfully send to the selected candidates",
  });
});

//shortlist application
export const updateApplicationStatus = catchAsync(async (req, res) => {
  const { applicationIds, status } = req.body;

  const result = await careerServices.updateApplicationStatus(
    applicationIds,
    status
  );

  res.status(200).json({
    success: true,
    message: `Applications updated to ${status}`,
    result,
  });
});
