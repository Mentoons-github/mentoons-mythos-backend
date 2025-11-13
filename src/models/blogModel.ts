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
    commentsOff: {
      type: Boolean,
      default: false,
    },
    commentCount: {
      type: Number,
    },
    viewers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    searchTitle: String,
    searchWriter: String,
    searchTags: [String],
  },
  {
    timestamps: true,
  }
);
blogSchema.pre("save", function (next) {
  this.searchTitle = this.title.replace(/[\s-_]/g, "").toLowerCase();
  this.searchWriter = this.writer.replace(/[\s-_]/g, "").toLowerCase();
  this.searchTags = this.tags.map((tag) =>
    tag.replace(/[\s-_]/g, "").toLowerCase()
  );
  next();
});

const Blog = mongoose.model<IBlogDocument>("Blog", blogSchema);
export default Blog;
