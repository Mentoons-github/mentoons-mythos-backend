import { Types } from "mongoose";
import { IBlog } from "../interfaces/blogInterface";
import Blog from "../models/blogModel";
import User from "../models/userModel";
import CustomError from "../utils/customError";
import { IComment } from "../interfaces/commentInterface";
import Comment from "../models/commentModel";
import Report from "../models/ReportModel";

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
export const fetchBlog = async (
  skip: number,
  limit: number,
  sort: string,
  search?: string
) => {
  const query: any = {};
  if (search) {
    query.$or = [
      { writer: { $regex: search, $options: "i" } },
      { title: { $regex: search, $options: "i" } },
      { tags: { $regex: search, $options: "i" } },
    ];
  }

  const sortOrder = sort === "newest" ? -1 : 1;
  const blogs = await Blog.find(query)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: sortOrder });

  const total = await Blog.countDocuments(query);

  return { blogs, total };
};

//fetch total blogs
export const fetchBlogCount = async () => {
  const blogs = await Blog.find()
  return blogs.length
}

//fetch single blog
export const fetchSingleBlog = async (blogId: string) => {
  const blog = await Blog.findById(blogId);
  if (!blog) throw new Error("Blog not found");

  const reports = await Report.find({ fromId: blogId });

  const updatedBlog = {
    ...blog.toObject(),
    reportLength: reports.length,
  };

  return {
    blog: updatedBlog,
    reports,
  };
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
    { $inc: { commentCount: 1 } },
    { new: true }
  );

  return newComment;
};

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
  const comments = await Comment.find({ blogId }).sort({ createdAt: -1 });

  const reports = await Report.aggregate([
    { $match: { commentId: { $ne: null } } },
    { $group: { _id: "$commentId", count: { $sum: 1 } } },
  ]);

  const reportMap = reports.reduce((acc: Record<string, number>, r) => {
    acc[r._id.toString()] = r.count;
    return acc;
  }, {});

  const updatedComments = comments.map((comment) => ({
    ...comment.toObject(),
    reportLength: reportMap[comment._id.toString()] || 0,
  }));

  return updatedComments;
};

//delete comment
export const deleteComment = async (commentId: string) => {
  const comment = await Comment.findById(commentId);
  if (!comment) throw new CustomError("Comment not found", 400);

  await Comment.findByIdAndDelete(commentId);

  await Blog.findByIdAndUpdate(
    comment.blogId,
    { $inc: { commentCount: -1 } },
    { new: true }
  );
  return { message: "Comment deleted successfully" };
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

//deleteBlog
export const deleteBlog = async (blogId: string) => {
  const deletedBlog = await Blog.findByIdAndDelete(blogId);
  if (!deletedBlog) throw new CustomError("Blog not found", 400);
  return blogId;
};
