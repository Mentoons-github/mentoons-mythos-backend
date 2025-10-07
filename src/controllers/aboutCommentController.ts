import catchAsync from "../utils/cathAsync";
import * as AboutCommentService from "../services/aboutCommentService";

//post comment
export const createAboutComment = catchAsync(async (req, res) => {
  const newComment = await AboutCommentService.createAboutComment(req.body);
  res.status(200).json({ message: "Successfully posted the comment" });
});

//get comments
export const getAboutComments = catchAsync(async (req, res) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const page = parseInt(req.query.page as string) || 1;
  const sort = (req.query.sort as "newest" | "oldest") || "newest";
  const search = (req.query.search as string) || "";

  const comments = await AboutCommentService.getAboutComments(
    limit,
    page,
    sort,
    search
  );
  res
    .status(200)
    .json({ message: "Successfully fetch the comments", ...comments });
});

//get single comment
export const getSingleAboutComment = catchAsync(async (req, res) => {
  const { commentId } = req.params;
  const comment = await AboutCommentService.getSingleAboutComment(commentId);
  res.status(200).json({ message: "Successfully fetch the comment", comment });
});

//delete comment
export const deleteAboutComment = catchAsync(async (req,res) => {
    const {commentId} = req.params
    await AboutCommentService.deleteAboutComment(commentId)
    res.status(200).json({message:"Comment successfully deleted"})
})


