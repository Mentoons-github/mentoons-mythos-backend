import mongoose from "mongoose";
import { IBlog } from "../interfaces/blogInterface";

export interface IBlogDocument extends IBlog, Document {}

const blogSchema = new mongoose.Schema(
  {
    file: {
      type: String,
    },
    writerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    writer:{
        type:String,
        required:true
    },
    title: {
      type: String,
    },
    description:{
        type:String,
        required:true,
    },

  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.model<IBlogDocument>('Blog', blogSchema)
export default Blog
