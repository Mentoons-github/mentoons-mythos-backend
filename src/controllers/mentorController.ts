import catchAsync from "../utils/cathAsync";
import * as mentorService from "../services/mentorService";

export const submitMentorForm = catchAsync(async (req, res) => {
  const user = req.user;
  const mentor = await mentorService.submitMentorForm(user._id, req.body);
  res.status(200).json({message:"Successfully submitted your form"})
});
