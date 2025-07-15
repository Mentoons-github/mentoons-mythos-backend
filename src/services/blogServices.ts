import { Types } from "mongoose";
import { IBlog } from "../interfaces/blogInterface";
import Blog from "../models/blogModel";
import User from "../models/userModel";
import CustomError from "../utils/customError";
import { IComment } from "../interfaces/commentInterface";
import Comment from "../models/commentModel";

export const createBlog = async (data: IBlog, userId: string) => {
  const user = await User.findById(userId).select("firstName lastName");
  const blog = await Blog.create({
    file: data?.file,
    writerId: new Types.ObjectId(userId),
    writer: `${user?.firstName} ${user?.lastName}`,
    title: data.title,
    description: data.description,
    tags: Array.isArray(data.tags) ? data.tags.map((tag) => tag.trim()) : [],
  });

  console.log(blog, "blog");
  return blog;
};

export const fetchBlog = async (skip: number = 0, limit: number = 10) => {
  const blogs = await Blog.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Blog.countDocuments();

  return { blogs, total };
};

export const userBlog = async (userId: string) => {
  const blogs = await Blog.find({ writerId: userId });
  console.log("blogs data :", blogs);
  return blogs;
};
export const likeBlog = async (blogId: string, userId: string ) => {
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

export const addComment = async (blogId:string, userId:string, comment:IComment) => {
  const user = await User.findById(userId)
  const newComment = await Comment.create({
    blogId,
    userId,
    username:`${user?.firstName} ${user?.lastName}`,
    comment
  })

  return newComment
}

export const getComments = async (blogId:string) =>{
  const blog = await Comment.find({blogId}).sort({createdAt: -1})
  return blog
}
