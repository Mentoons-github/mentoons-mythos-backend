import catchAsync from "../utils/cathAsync";
import * as assessmentService from "../services/assessmentServices";

export const assessmentSubmission = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const details = req.body;
  const assessment = await assessmentService.assessmentSubmission(
    userId,
    details
  );
  res.status(201).json({
    success: true,
    message: `Assessment submitted for ${assessment.assessmentName}`,
    assessment,
  });
});

//createquestion
export const createAssessment = catchAsync(async (req, res) => {
  const assessment = await assessmentService.createAssessment(req.body);
  res.status(201).json({
    message: `New assessment question created in ${assessment.name} for ${assessment.type} assessment`,
  });
});

//getquestions
export const getAssessmentQuestion = catchAsync(async (req, res) => {
  const assessement = await assessmentService.getAssessmentQuestion(
    req.params.name
  );
  res.status(200).json({ message: "Fetched the questions", assessement });
});

//getAll assessments
export const getAllAssessments = catchAsync(async (req, res) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const page = parseInt(req.query.page as string) || 1;
  const sort = (req.query.sort as "newest" | "oldest") || "newest";
  const search = (req.query.search as string) || "";
  const assessments = await assessmentService.getAllAssessments(
    limit,
    page,
    sort,
    search
  );
  res
    .status(200)
    .json({ message: "Fetched all assessments", success: true, ...assessments });
});

//get Single submission
export const getSingleSubmission = catchAsync(async (req, res) => {
  const details = await assessmentService.getSingleSubmission(
    req.params.submissionId
  );
  res
    .status(200)
    .json({ message: "Fetched single assessment", success: true, details });
});

//get firstquestions
export const getFirstAssessmentQuestions = catchAsync(async (req, res) => {
  const questions = await assessmentService.getFirstAssessmentQuestions();
  res.status(200).json({ message: "Fetched questions", questions });
});

//store initilal assessment details
export const initialSubmission = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const details = await assessmentService.initialSubmission(req.body, userId);
  res.status(200).json({
    success: true,
    message: "Successfully submitted the assessment",
  });
});

//get initial assessment detils
export const getInitialAssessmentSubmissions = catchAsync(async (req, res) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const page = parseInt(req.query.page as string) || 1;
  const sort = (req.query.sort as "newest" | "oldest") || "newest";
  const search = (req.query.search as string) || "";
  const details = await assessmentService.getInitialAssessmentSubmissions(
    limit,
    page,
    sort,
    search
  );
  res.status(200).json({
    message: "Successfully fetched initial assessment details",
    ...details,
  });
});

// get single initial assessment details
export const getSingleInitialAssessmentDetails = catchAsync(
  async (req, res) => {
    const { assessmentId } = req.params;
    const details = await assessmentService.getSingleInitialAssessmentDetails(
      assessmentId
    );
    res.status(200).json({
      message: "Fetched the single initial assessment details",
      details,
    });
  }
);

//delete assessmet submision
export const deleteAssessmentSubmission = catchAsync(async(req,res) => {
  const {assessmentId} = req.params
  await assessmentService.deleteAssessmentSubmission(assessmentId)
  res.status(200).json({message:"Assessment submitted details successfully deleted"})
})

//delete initial assessmet submision
export const deleteInitialAssessmentSubmission = catchAsync(async(req,res) => {
  const {assessmentId} = req.params
  await assessmentService.deleteInitialAssessmentSubmission(assessmentId)
  res.status(200).json({message:"Assessment submitted details successfully deleted"})
})
