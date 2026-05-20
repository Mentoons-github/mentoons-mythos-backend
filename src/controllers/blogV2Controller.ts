import catchAsync from "../utils/cathAsync";
import * as blogServicesV2 from "../services/blogV2Sevices";

//create blog post
export const createBlogV2 = catchAsync(async (req, res) => {
  const { blog, badge, reward } = await blogServicesV2.createBlogV2(
    req.body,
    req.user._id,
  );
  res.status(201).json({ message: "Blog Created", blog, reward, badge });
});

//get blog post
export const fetchBlogV2 = catchAsync(async (req, res) => {
  const skip = parseInt(req.query.skip as string) || 0;
  const limit = parseInt(req.query.limit as string) || 5;
  const sort = (req.query.sort as "newest" | "oldest") || "newest";
  const search = (req?.query?.search as string) || "";

  const { blogs, total } = await blogServicesV2.fetchBlogV2(
    skip,
    limit,
    sort,
    search,
  );
  res.status(200).json({
    message: "Successfully fetched blogs",
    blogs,
    total,
    // userId:req.user._id
  });
});

//fetch single blog
export const fetchSingleBlogV2 = catchAsync(async (req, res) => {
  const blog = await blogServicesV2.fetchSingleBlogV2(req.params.blogId);
  res.status(200).json({ message: "Single blog fetched", blog: blog.blog });
});

//like blog
export const toggleLikeV2 = catchAsync(async (req, res) => {
  const blogId = req.params.blogId;
  const userId = req.user._id;
  const { blog, reward } = await blogServicesV2.likeBlogV2(blogId, userId);
  res.status(200).json({
    message: blog.likes?.includes(userId) ? "Blog liked" : "Blog unliked",
    //   likesCount: updatedBlog.likes?.length,
    likes: blog.likes,
    blogId,
    reward,
  });
});

//add comment
export const addCommentV2 = catchAsync(async (req, res) => {
  const { blogId } = req.params;
  const userId = req.user._id;
  const { comment } = req.body;
  const { newComment, reward } = await blogServicesV2.addCommentV2(
    blogId,
    userId,
    comment,
  );
  res.status(201).json({ message: "Comment Posted", newComment, reward });
});

//get comments
export const getCommentsV2 = catchAsync(async (req, res) => {
  const skip = parseInt(req.query.skip as string) || 0;
  const limit = parseInt(req.query.limit as string) || 15;
  const { blogId } = req.params;
  const { comments, total } = await blogServicesV2.getCommentsV2(
    blogId,
    skip,
    limit,
  );

  res.status(200).json({ message: "Fetched comments", comments, total });
});

//reply comments
export const replyCommentV2 = catchAsync(async (req, res) => {
  const { commentId } = req.params;
  const { replyText, replyToUserId } = req.body;
  const userId = req.user._id;
  const updatedComment = await blogServicesV2.replyCommentV2(
    commentId,
    userId,
    replyText,
    replyToUserId,
  );
  res.status(200).json({ message: "Reply added", comment: updatedComment });
});

//get replyComments
export const getReplyCommentsV2 = catchAsync(async (req, res) => {
  const { commentId } = req.params;
  const skip = parseInt(req.query.skip as string) || 0;
  const limit = parseInt(req.query.limit as string) || 15;
  const { replyComments, total } = await blogServicesV2.getReplyCommentsV2(
    commentId,
    skip,
    limit,
  );
  res
    .status(200)
    .json({ message: "Fetched reply comments", replyComments, total });
});

//delete blog
export const deleteBlogV2 = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const { blogId, reward } = await blogServicesV2.deleteBlogV2(
    req.params.blogId,
    userId,
  );
  res
    .status(200)
    .json({ message: "Blog Successfully deleted", blogId, reward });
});

//delete comment
export const deleteCommentV2 = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const { commentId } = req.params;
  const { message, reward, type } = await blogServicesV2.deleteCommentV2(
    commentId,
    userId,
  );
  res.status(200).json({ success: true, message, reward, type });
});

//edit comment
export const editCommentV2 = catchAsync(async (req, res) => {
  const { commentId } = req.params;
  const { newComment } = req.body;
  const { type, updated } = await blogServicesV2.editCommentV2(
    commentId,
    newComment,
  );
  res
    .status(200)
    .json({ success: true, message: "Comment edited", updated, type });
});

//comment on-off
export const commentOffToggle = catchAsync(async (req, res) => {
  const { blogId } = req.params;
  const updated = await blogServicesV2.commentOffToggle(blogId);
  const updatedValue = updated.commentsOff ? "Off" : "On";
  res.status(200).json({
    success: true,
    message: `Comment successfully turned ${updatedValue}`,
  });
});

//userblogs
export const fetchUserBlogsV2 = catchAsync(async (req, res) => {
  const userId = req.user._id;
  console.log(userId);
  const blogs = await blogServicesV2.userBlogV2(userId);
  res.status(200).json({ message: "Blogs fetched successfully", blogs });
});
