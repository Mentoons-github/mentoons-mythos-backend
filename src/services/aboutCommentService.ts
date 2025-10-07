import { AboutCommentI } from "../interfaces/about&newsletter";
import AboutComment from "../models/aboutCommentModel";
import CustomError from "../utils/customError";

// post comment
export const createAboutComment = async (details: AboutCommentI) => {
  const { comment, email, name } = details;
  if (!comment || !email || !name) {
    throw new CustomError("Please fill all fields", 400);
  }
  const newComment = await AboutComment.create({
    email,
    name,
    comment,
  });
  return newComment;
};

// get comments
export const getAboutComments = async (
  limit: number,
  page: number,
  sort: string,
  search?: string
) => {
  const skip = (page - 1) * limit;
  const query: any = {};
  const sortOrder = sort == "newest" ? -1 : 1;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }
  const comments = await AboutComment.find(query)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: sortOrder });
  const total = await AboutComment.countDocuments(query);
  return { comments, page, totalPages: Math.ceil(total / limit) };
};

// get single comment
export const getSingleAboutComment = async (commentId: string) => {
  if (!commentId) throw new CustomError("Comment id not provided", 400);
  const comment = await AboutComment.findById(commentId);
  return comment;
};

// delete comment
export const deleteAboutComment = async (commentId: string) => {
  if (!commentId) throw new CustomError("Comment id not provided", 400);
  await AboutComment.findByIdAndDelete(commentId);
};
