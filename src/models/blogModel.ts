import mongoose, { Schema } from "mongoose";
import { IBlog } from "../interfaces/blogInterface";

export interface IBlogDocument extends IBlog, Document {}

const blogSchema = new mongoose.Schema<IBlogDocument>(
  {
    file: {
      type: String,
    },
    writerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    writer: {
      type: String,
      required: true,
    },
    title: {
      type: String,
    },
    tags: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      required: true,
    },
     likes: [{ type: Schema.Types.ObjectId, ref: "User" }],


  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.model<IBlogDocument>("Blog", blogSchema);
export default Blog;
