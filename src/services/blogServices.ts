import { Types } from "mongoose";
import { IBlog } from "../interfaces/blogInterface";
import Blog from "../models/blogModel";
import User from "../models/userModel";

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

export const fetchBlog = async () => {
  const blogs = await Blog.find();
  return blogs;
};
