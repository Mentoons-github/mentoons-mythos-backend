import { Types } from "mongoose";
import { IBlog } from "../interfaces/blogInterface";
import Blog from "../models/blogModel";
import User from "../models/userModel";
import CustomError from "../utils/customError";
import { IComment } from "../interfaces/commentInterface";
import Comment from "../models/commentModel";

//create blog
export const createBlog = async (data: IBlog, userId: string) => {
  const user = await User.findById(userId).select("firstName lastName");
  const blog = await Blog.create({
    file: data?.file,
    commentsOff: data?.commentsOff,
    writerId: new Types.ObjectId(userId),
    writer: `${user?.firstName} ${user?.lastName}`,
    title: data.title,
    description: data.description,
    tags: Array.isArray(data.tags) ? data.tags.map((tag) => tag.trim()) : [],
  });

  console.log(blog, "blog");
  return blog;
};

//fetch blog
export const fetchBlog = async (skip: number = 0, limit: number = 10) => {
  const blogs = await Blog.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Blog.countDocuments();

  return { blogs, total };
};

//fetch single blog
export const fetchSingleBlog = async (blogId: string) => {
  const blog = await Blog.findById(blogId);
  return blog;
};

//user blog
export const userBlog = async (userId: string) => {
  const blogs = await Blog.find({ writerId: userId });
  console.log("blogs data :", blogs);
  return blogs;
};

//like blog
export const likeBlog = async (blogId: string, userId: string) => {
  const blog = await Blog.findById(blogId);
  if (!blog) throw new CustomError("Blog not found", 404);
  const hasLiked = blog.likes?.includes(new Types.ObjectId(userId));
  if (hasLiked) {
    blog.likes = blog.likes?.filter((id) => !id.equals(userId));
  } else {
    blog.likes?.push(new Types.ObjectId(userId));
  }
  await blog.save();
  return blog;
};

//comment blog
export const addComment = async (
  blogId: string,
  userId: string,
  comment: IComment
) => {
  const user = await User.findById(userId);
  const newComment = await Comment.create({
    blogId,
    userId,
    username: `${user?.firstName} ${user?.lastName}`,
    profile: `${user?.profilePicture}`,
    comment,
  });

  await Blog.findByIdAndUpdate(
    blogId,
    { $inc: { commentsCount: 1 } },
    { new: true }
  );

  return newComment;
};

//reply comment
export const replyComment = async (
  commentId: string,
  userId: string,
  replyText: string
) => {
  const user = await User.findById(userId);
  return await Comment.findByIdAndUpdate(
    commentId,
    {
      $push: {
        reply: {
          userId,
          username: `${user?.firstName} ${user?.lastName}`,
          replyText,
          profile: user?.profilePicture,
        },
      },
    },
    { new: true }
  );
};

//get comments
export const getComments = async (blogId: string) => {
  const blog = await Comment.find({ blogId }).sort({ createdAt: -1 });
  return blog;
};

//increase view count
export const increaseViewsCount = async (blogId: string, userId: string) => {
  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw new CustomError("Blog not found", 404);
  }

  const userObjectId = new Types.ObjectId(userId);
  const alreadyViewed = blog.viewers.some((viewerId) =>
    viewerId.equals(userObjectId)
  );

  if (!alreadyViewed) {
    blog.viewers.push(userObjectId);
    await blog.save();
  }

  return blog.viewers.length;
};

//fetch blog by views
export const fetchBlogByViews = async () => {
  const blogs = await Blog.aggregate([
    {
      $addFields: {
        viewsCount: { $size: { $ifNull: ["$viewers", []] } },
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "blogId",
        as: "blogComments",
      },
    },
    {
      $addFields: {
        commentCount: { $size: "$blogComments" },
      },
    },
    {
      $sort: { viewsCount: -1 },
    },
    {
      $limit: 3,
    },
    {
      $project: {
        blogComments: 0,
      },
    },
  ]);
  return blogs;
};

//serch blogs
export const searchBlogs = async (query: string) => {
  const sanitizedKeyword = query.replace(/[\s-_]/g, "").toLowerCase();
  const regex = new RegExp(sanitizedKeyword, "i");

  const blogs = await Blog.find({
    $or: [
      { searchTitle: regex },
      { searchWriter: regex },
      { searchTags: regex },
    ],
  }).select("title writer tags");

  return blogs;
};
