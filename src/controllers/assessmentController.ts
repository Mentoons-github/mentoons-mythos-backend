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
  const assessments = await assessmentService.getAllAssessments();
  res.status(200).json({ message: "Fetched all assessments", success: true, assessments });
});

//get Single submission
export const getSingleSubmission = catchAsync(async (req,res) => {
  const details = await assessmentService.getSingleSubmission(req.params.submissionId)
  res.status(200).json({message:"Fetched single assessment", success:true, details})
})
