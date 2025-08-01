import catchAsync from "../utils/cathAsync";
import * as assessmentService from "../services/assessmentServices";

export const assessmentSubmission = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const details = req.body;
  const assessment = await assessmentService.assessmentSubmission(
    userId,
    details
  );

  console.log(assessment)

  res
    .status(201)
    .json({
      success: true,
      message: `Assessment submitted for ${assessment.assessmentName}`,
      assessment,
    });
});
