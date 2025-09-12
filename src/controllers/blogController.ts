import catchAsync from "../utils/cathAsync";
import * as blogServices from "../services/blogServices";

//create blog
export const createBlog = catchAsync(async (req, res) => {
  const blog = await blogServices.createBlog(req.body, req.user._id);
  res.status(201).json({ message: "Blog Created", blog });
});

//fetch blog
export const fetchBlog = catchAsync(async (req, res) => {
  const skip = parseInt(req.query.skip as string) || 0;
  const limit = parseInt(req.query.limit as string) || 0;
  const sort = (req.query.sort as "newest" | "oldest") || "newest";
  const search = (req.query.search as string) || "";

  const { blogs, total } = await blogServices.fetchBlog(skip, limit, sort, search);
  res.status(200).json({
    message: "Successfully fetched blogs",
    blogs,
    total,
    // userId:req.user._id
  });
});

//fetch blog count
export const fetchBlogCount = catchAsync(async(req,res) => {
  const count = await blogServices.fetchBlogCount()
  res.status(200).json({message:"Blog count fetched", count})
})

//fetch single blog
export const fetchSingleBlog = catchAsync(async (req, res) => {
  const blog = await blogServices.fetchSingleBlog(req.params.blogId);
  res.status(200).json({ message: "Single blog fetched", blog: blog.blog });
});
export const fetchUserBlogs = catchAsync(async (req, res) => {
  const userId = req.user._id;
  console.log(userId);
  const blogs = await blogServices.userBlog(userId);
  res.status(200).json({ message: "Blogs fetched successfully", blogs });
});

//like blog
export const toggleLike = catchAsync(async (req, res) => {
  const blogId = req.params.blogId;
  const userId = req.user._id;
  const updatedBlog = await blogServices.likeBlog(blogId, userId);
  res.status(200).json({
    message: updatedBlog.likes?.includes(userId)
      ? "Blog liked"
      : "Blog unliked",
    //   likesCount: updatedBlog.likes?.length,
    likes: updatedBlog.likes,
    blogId,
  });
});

//add comment
export const addComment = catchAsync(async (req, res) => {
  const { blogId } = req.params;
  const userId = req.user._id;
  const { comment } = req.body;
  const newComment = await blogServices.addComment(blogId, userId, comment);
  res.status(201).json({ message: "Comment Posted", newComment });
});

//reply comments
export const replyComment = catchAsync(async (req, res) => {
  const { commentId } = req.params;
  const { replyText } = req.body;
  const userId = req.user._id;
  const updatedComment = await blogServices.replyComment(
    commentId,
    userId,
    replyText
  );
  res.status(200).json({ message: "Reply added", comment: updatedComment });
});

//get comments
export const getComments = catchAsync(async (req, res) => {
  const { blogId } = req.params;
  const comments = await blogServices.getComments(blogId);
  res.status(200).json({ message: "Fetched comments", comments });
});

export const deleteComment = catchAsync(async (req, res) => {
  const { commentId } = req.params;
  const deleted = await blogServices.deleteComment(commentId);
  res
    .status(200)
    .json({ success: true, message: "Comment successfully deleted" });
});

//increase biew count
export const increaseViewsCount = catchAsync(async (req, res) => {
  const { blogId } = req.params;
  const userId = req.user._id;
  const totalViews = await blogServices.increaseViewsCount(blogId, userId);
  res.status(200).json({
    status: "success",
    message: "View count updated",
    totalViews,
  });
});

//fetch blog by views
export const fetchBlogByViews = catchAsync(async (req, res) => {
  const blogs = await blogServices.fetchBlogByViews();
  res.status(200).json({
    status: "success",
    message: "Successfully fetched blogs",
    blogs,
  });
});

//search blogs
export const searchBlogs = catchAsync(async (req, res) => {
  const { query } = req.query;
  const blogs = await blogServices.searchBlogs(query);
  res.status(200).json({
    success: true,
    results: blogs.length,
    data: blogs,
  });
});

//delete blog
export const deleteBlog = catchAsync(async (req, res) => {
  const blogId = await blogServices.deleteBlog(req.params.blogId);

  res.status(200).json({ message: "Blog Successfully deleted", blogId });
});
