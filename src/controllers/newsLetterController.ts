import catchAsync from "../utils/cathAsync";
import * as newsLetterService from "../services/newsLetterServices";

//post newsletter
export const submitNewsLetter = catchAsync(async (req, res) => {
  await newsLetterService.submitNewsLetter(req.body);
  res.status(200).json({ message: "Newsletter subscription successfull" });
});

//get newsletters
export const getNewsLetters = catchAsync(async (req, res) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const page = parseInt(req.query.page as string) || 1;
  const sort = (req.query.sort as "newest" | "oldest") || "newest";
  const search = (req.query.search as string) || "";
  const letters = await newsLetterService.getNewsLetters(
    limit,
    page,
    sort,
    search
  );
  res
    .status(200)
    .json({ message: "Successfully fetch the newsletter users", ...letters });
});

//get single newsletter
export const getSingleNewsletter = catchAsync(async (req, res) => {
  const { newsletterId } = req.params;
  const letter = await newsLetterService.getSingleNewsLetter(newsletterId);
  res.status(200).json({ message: "Successfully fetch the newsletter user", letter });
});

//delete newsletter
export const deleteNewsletter = catchAsync(async (req, res) => {
  const { newsletterId } = req.params;
  await newsLetterService.deleteNewsLetter(newsletterId);
  res.status(200).json({ message: "Newsletter successfully deleted" });
});

//send message to mail
export const sendMessageToMail = catchAsync(async(req,res) => {
  await newsLetterService.sendMessageToMail(req.body)
  res.status(200).json({message:"Message succesfully send to the emails"})
})
