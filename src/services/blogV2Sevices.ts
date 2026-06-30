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
import Badge from "../models/badgeModel";
import { assignBadge } from "./badgeService";
import mongoose from "mongoose";
import { BlogActionMail } from "../utils/blogActionMail";
import Block from "../models/blockModel";

export const createBlogV2 = async (data: IBlogV2, userId: string) => {
  const existingPostCount = await BlogV2.countDocuments({
    user: new Types.ObjectId(userId),
  });

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

  const isFirstPost = existingPostCount === 0;
  let badge = null;

  if (isFirstPost) {
    badge = await Badge.findOne({
      "criteria.action": "post_created",
    });
  }

  if (badge) {
    await assignBadge(userId, badge._id);
  }

  const reward = await addRewardPoints({
    userId,
    action: "POST_BLOG",
    points: 10,
  });

  const populatedBlog = await blog.populate(
    "user",
    "firstName lastName profilePicture",
  );

  return { blog: populatedBlog, reward, badge };
};

//feth blog
export const fetchBlogV2 = async (
  skip: number,
  limit: number,
  sort: string,
  isAdmin: boolean,
  currentUserId: string,
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

  if (!isAdmin) {
    query.moderationStatus = "active";
  }

  if (currentUserId) {
    const blockedUsers = await Block.find({
      blockedBy: currentUserId,
    }).select("blockedUser");

    const blockedUserIds = blockedUsers.map((block) => block.blockedUser);

    if (blockedUserIds.length > 0) {
      query.user = {
        $nin: blockedUserIds,
      };
    }
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

//fetch single blog
export const fetchSingleBlogV2 = async (blogId: string) => {
  const blog = await BlogV2.findById(blogId).populate(
    "user",
    "firstName lastName profilePicture",
  );
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
  isAdmin: boolean,
  blogId: string,
  skip: number,
  limit: number,
) => {
  const query: any = {
    blogId,
  };

  // if (!isAdmin) {
  //   query.moderationStatus = "active";
  // }
  const comments = await Comment.find(query)
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
  isAdmin: boolean,
) => {
  const query: any = {
    commentId,
  };

  // if (!isAdmin) {
  //   query.moderationStatus = "active";
  // }
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
  const user = await User.findById(userId);
  const blog = await BlogV2.findById(blogId);

  const isOwner = blog?.user?.toString() === user?._id?.toString();
  const isAdmin = user?.role === "admin";

  if (!isOwner && !isAdmin) {
    throw new CustomError("You can't delete this blog", 400);
  }
  const deletedBlog = await BlogV2.findByIdAndDelete(blogId);
  if (!deletedBlog) throw new CustomError("Blog not found", 400);
  const reward = await addRewardPoints({
    userId,
    action: "DELETE_BLOG",
    points: 10,
  });
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

//comment off
export const commentOffToggle = async (blogId: string) => {
  const post = await BlogV2.findById(blogId);
  if (!post) {
    throw new CustomError("Post not found", 400);
  }
  post.commentsOff = !post.commentsOff;
  await post.save();
  return post;
};

//user blog
export const userBlogV2 = async (userId: string) => {
  const blogs = await BlogV2.find({ user: userId });
  return blogs;
};

//save blog
export const saveBlogV2 = async (userId: string, blogId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new CustomError("User not found", 400);
  }

  const isSaved = user.savedPosts.some((post) => post.toString() === blogId);

  if (isSaved) {
    user.savedPosts = user.savedPosts.filter(
      (post) => post.toString() !== blogId,
    );
  } else {
    user.savedPosts.push(new mongoose.Types.ObjectId(blogId));
  }

  await user.save();

  return {
    success: true,
    saved: !isSaved,
    savedPosts: user.savedPosts,
  };
};

// user saved blogs
export const userSavedBlogsV2 = async (userId: string) => {
  const user = await User.findById(userId).populate({
    path: "savedPosts",
    options: { sort: { createdAt: -1 } },
  });

  if (!user) {
    throw new CustomError("User not found", 400);
  }

  return user.savedPosts;
};

export const takeBlogActions = async (
  blogId: string,
  action: string,
  days?: number,
) => {
  const blog = await BlogV2.findById(blogId).populate(
    "user",
    "firstName lastName profilePicture",
  );

  if (!blog) {
    throw new CustomError("Blog not found", 404);
  }

  const user = await User.findById(blog.user).select("email");

  if (!user) {
    throw new CustomError("User not found", 404);
  }

  const email = user.email;

  switch (action) {
    // DELETE BLOG
    case "delete":
      blog.moderationStatus = "deleted";
      await blog.save();

      return {
        success: true,
        message: "Blog removed successfully",
        blog,
      };

    // HIDE BLOG
    case "hide":
      if (blog.moderationStatus === "deleted") {
        return {
          success: true,
          message: "Can't hide blog. Blog already deleted",
          blog,
        };
      } else if (blog.moderationStatus === "hidden") {
        blog.moderationStatus = "active";
        await blog.save();

        return {
          success: true,
          message: "Blog un hidden successfully",
          blog,
        };
      } else {
        blog.moderationStatus = "hidden";

        await blog.save();

        return {
          success: true,
          message: "Blog hidden successfully",
          blog,
        };
      }

    // TURN OFF COMMENTS
    case "comment_off":
      if (blog.commentsOff) {
        blog.commentsOff = false;
        await blog.save();

        return {
          success: true,
          message: "Comments on successfully",
          blog,
        };
      } else {
        blog.commentsOff = true;

        await blog.save();

        return {
          success: true,
          message: "Comments disabled successfully",
          blog,
        };
      }

    // WARN USER
    case "warn_user":
      const updatedUser = await User.findByIdAndUpdate(
        blog.user,
        {
          $push: {
            warnings: {
              reason: "Community guideline violation",
              createdAt: new Date(),
            },
          },
          $inc: {
            warningCount: 1,
          },
        },
        { new: true },
      );

      if (!updatedUser) {
        throw new CustomError("User not found", 404);
      }

      if (updatedUser.warningCount >= 10) {
        updatedUser.isBlocked = true;
        updatedUser.bannedUntil = null;
        await updatedUser.save();

        await BlogActionMail({
          email,
          action: "perBan",
        });

        return {
          success: true,
          message: "User permanently banned after receiving 10 warnings",
          blog,
        };
      }

      await BlogActionMail({
        email,
        action: "warn_user",
      });

      return {
        success: true,
        message: `User warned successfully (${updatedUser.warningCount}/10 warnings)`,
        blog,
      };

    // BAN USER
    case "ban_user":
      const user = await User.findById(blog.user);

      if (!user) {
        throw new CustomError("User not found", 404);
      }

      if (user.isBlocked) {
        throw new CustomError("User already blocked", 404);
      }

      if (days === 0) {
        user.isBlocked = true;
        user.bannedUntil = null;
      } else {
        const bannedUntil = new Date();

        bannedUntil.setDate(bannedUntil.getDate() + Number(days));

        user.isBlocked = true;
        user.bannedUntil = bannedUntil;
      }

      await user.save();

      await BlogActionMail({
        email,
        action: days === 0 ? "perBan" : "ban_user",
        days,
      });

      return {
        success: true,
        message:
          days === 0
            ? "User permanently banned"
            : `User banned for ${days} days`,
        blog,
      };

    default:
      throw new CustomError("Invalid action", 400);
  }
};
