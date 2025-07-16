import catchAsync from "../utils/cathAsync";
import * as blogServices from "../services/blogServices";

export const createBlog = catchAsync(async (req, res) => {
  const blog = await blogServices.createBlog(req.body, req.user._id);
  res.status(201).json({ message: "Blog Created", blog });
});

export const fetchBlog = catchAsync(async (req, res) => {
  const skip = parseInt(req.query.skip as string) || 0;
  const limit = parseInt(req.query.limit as string) || 10;

  const { blogs, total } = await blogServices.fetchBlog(skip, limit);

  res.status(200).json({
    message: "Successfully fetched blogs",
    blogs,
    total,
    userId:req.user._id
  });
});

export const fetchSingleBlog = catchAsync (async (req,res) => {
  const blog = await blogServices.fetchSingleBlog(req.params.blogId)
  res.status(200).json({message:"Single blog fetched", blog})
})
export const fetchUserBlogs = catchAsync(async (req, res) => {
  const userId = req.user._id;
  console.log(userId);
  const blogs = await blogServices.userBlog(userId);

  res.status(200).json({ message: "Blogs fetched successfully", blogs });
});
 


export const toggleLike = catchAsync(async (req, res) => {
    const blogId = req.params.blogId;
    const userId = req.user._id; 
    const updatedBlog = await blogServices.likeBlog(blogId, userId);
    res.status(200).json({
      message: updatedBlog.likes?.includes(userId) ? "Blog liked" : "Blog unliked",
    //   likesCount: updatedBlog.likes?.length,
      likes: updatedBlog.likes,
      blogId
    });
  
}) 

export const addComment = catchAsync(async(req,res) => {
    const { blogId } = req.params
    const userId = req.user._id
    const {comment} = req.body
    const newComment = await blogServices.addComment(blogId, userId, comment)

    res.status(201).json({message:"Comment Posted", newComment})
})

export const replyComment = catchAsync(async(req,res) => {
  const { commentId } = req.params;
  const { replyText } = req.body;
  const userId = req.user._id;

  const updatedComment = await blogServices.replyComment(commentId, userId, replyText);
  res.status(200).json({ message: "Reply added", comment: updatedComment });
})

export const getComments = catchAsync(async(req,res) => {
    const {blogId} = req.params
    const comments = await blogServices.getComments(blogId)
    res.status(200).json({message:"Fetched comments", comments})
})
