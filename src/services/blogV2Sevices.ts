import { Types } from "mongoose";
import { IBlogV2 } from "../interfaces/blogInterface";
import BlogV2 from "../models/BlogV2Model";
import { addRewardPoints } from "./RewardPointServices";
import CustomError from "../utils/customError";
import { IComment } from "../interfaces/commentInterface";
import User from "../models/userModel";
import Comment from "../models/commentModel";
import Report from "../models/ReportModel";
import CommentReply from "../models/commentReplyModel";

export const createBlogV2 = async (data: IBlogV2, userId: string) => {
  const blog = await BlogV2.create({
    postType: data.postType,
    media: data.media,
    commentsOff: data?.commentsOff,
    user: new Types.ObjectId(userId),
    event: data.event,
    article: data.article,
    content: data.content,
    tags: Array.isArray(data.tags) ? data.tags.map((tag) => tag.trim()) : [],
  });

  const reward = await addRewardPoints({
    userId,
    action: "POST_BLOG",
    points: 10,
  });

  const populatedBlog = await blog.populate(
    "user",
    "firstName lastName profilePicture",
  );

  return { blog: populatedBlog, reward };
};

export const fetchBlogV2 = async (
  skip: number,
  limit: number,
  sort: string,
  search?: string,
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
  const blogs = await BlogV2.find(query)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: sortOrder })
    .populate("user", "firstName lastName profilePicture");

  const total = await BlogV2.countDocuments(query);

  return { blogs, total };
};

//like blog
export const likeBlogV2 = async (blogId: string, userId: string) => {
  const blog = await BlogV2.findById(blogId);
  if (!blog) throw new CustomError("Blog not found", 404);
  const hasLiked = blog.likes?.includes(new Types.ObjectId(userId));
  let reward = null;
  if (hasLiked) {
    blog.likes = blog.likes?.filter((id) => !id.equals(userId));
    reward = await addRewardPoints({
      userId,
      action: "UNLIKE_BLOG",
      points: 2,
      postId: blogId,
    });
  } else {
    blog.likes?.push(new Types.ObjectId(userId));
    reward = await addRewardPoints({
      userId,
      action: "LIKE_BLOG",
      points: 2,
      postId: blogId,
    });
  }
  await blog.save();
  return { blog, reward };
};

//comment blog
export const addCommentV2 = async (
  blogId: string,
  userId: string,
  comment: IComment,
) => {
  const newComment = await Comment.create({
    blogId,
    userId,
    comment,
  });

  const reward = await addRewardPoints({
    userId,
    action: "COMMENT_BLOG",
    points: 3,
    postId: blogId,
  });

  await BlogV2.findByIdAndUpdate(
    blogId,
    { $inc: { commentCount: 1 } },
    { new: true },
  );

  const populatedComment = await Comment.findById(newComment._id).populate({
    path: "userId",
    select: "firstName lastName profilePicture",
  });

  return { newComment: populatedComment, reward };
};

//get comments
export const getCommentsV2 = async (
  blogId: string,
  skip: number,
  limit: number,
) => {
  const comments = await Comment.find({ blogId })
    .populate({
      path: "userId",
      select: "firstName lastName profilePicture",
    })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const reports = await Report.aggregate([
    { $match: { commentId: { $ne: null } } },
    { $group: { _id: "$commentId", count: { $sum: 1 } } },
  ]);

  const reportMap = reports.reduce((acc: Record<string, number>, r) => {
    acc[r._id.toString()] = r.count;
    return acc;
  }, {});

  const updatedComments = comments.map((comment: any) => ({
    ...comment.toObject(),
    reportLength: reportMap[comment._id.toString()] || 0,
  }));

  const total = await Comment.countDocuments({ blogId });

  return { comments, total };
};

//reply comment
export const replyCommentV2 = async (
  commentId: string,
  userId: string,
  replyText: string,
  replyToUserId?: string,
) => {
  const user = await User.findById(userId).select(
    "firstName lastName profilePicture",
  );

  if (!user) {
    throw new Error("User not found");
  }

  const newReply = await CommentReply.create({
    commentId,
    userId,
    replyText,
    replyToUserId: replyToUserId || null,
  });

  await Comment.findByIdAndUpdate(commentId, {
    $inc: { replyCount: 1 },
  });
  const populatedReply = await CommentReply.findById(newReply._id)
    .populate({
      path: "userId",
      select: "firstName lastName profilePicture",
    })
    .populate({
      path: "replyToUserId",
      select: "firstName lastName profilePicture",
    });

  return populatedReply;
};

//get reply comments
export const getReplyCommentsV2 = async (
  commentId: string,
  skip: number,
  limit: number,
) => {
  const replyComments = await CommentReply.find({ commentId })
    .populate({
      path: "userId",
      select: "firstName lastName profilePicture",
    })
    .populate({
      path: "replyToUserId",
      select: "firstName lastName profilePicture",
    })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: 1 });

  const total = await Comment.countDocuments({ commentId });

  return { replyComments, total };
};

//deleteBlog
export const deleteBlogV2 = async (blogId: string, userId: string) => {
  const deletedBlog = await BlogV2.findByIdAndDelete(blogId);
  const reward = await addRewardPoints({
    userId,
    action: "DELETE_BLOG",
    points: 10,
  });
  if (!deletedBlog) throw new CustomError("Blog not found", 400);
  return { blogId, reward };
};

//delete comment
export const deleteCommentV2 = async (id: string, userId: string) => {
  const comment = await Comment.findById(id);

  if (comment) {
    await Comment.findByIdAndDelete(id);

    await CommentReply.deleteMany({ commentId: id });

    await BlogV2.findByIdAndUpdate(
      comment.blogId,
      { $inc: { commentCount: -1 } },
      { new: true },
    );

    const reward = await addRewardPoints({
      userId,
      action: "DELETE_COMMENT",
      points: 3,
    });

    return { message: "Comment deleted successfully", reward, type: "comment" };
  }

  const reply = await CommentReply.findById(id);

  if (reply) {
    await CommentReply.findByIdAndDelete(id);
    await Comment.findByIdAndUpdate(
      reply.commentId,
      { $inc: { replyCount: -1 } },
      { new: true },
    );
    return { message: "Reply deleted successfully", type: "replyComment" };
  }
  throw new CustomError("Comment or reply not found", 400);
};

//edit comment
export const editCommentV2 = async (commentId: string, newComment: string) => {
  let updated = await Comment.findByIdAndUpdate(
    commentId,
    {
      comment: newComment,
    },
    { new: true },
  );
  if (updated) {
    return { type: "comment", updated };
  }

  updated = await CommentReply.findByIdAndUpdate(
    commentId,
    { replyText: newComment },
    { new: true },
  );
  if (updated) {
    return { type: "replyComment", updated };
  }

  throw new CustomError("Comment or Reply not found", 400);
};

export const commentOffToggle = async (blogId: string) => {
  const post = await BlogV2.findById(blogId);
  if (!post) {
    throw new CustomError("Post not found", 400);
  }
  post.commentsOff = !post.commentsOff;
  await post.save();
  return post;
};
