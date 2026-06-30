import mongoose, { Schema } from "mongoose";
import { IBlogV2 } from "../interfaces/blogInterface";

export interface IBlogDocument extends IBlogV2, Document {}

const blogSchema = new mongoose.Schema<IBlogDocument>(
  {
    postType: {
      type: String,
      enum: ["image", "video", "event", "article", "text"],
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
    },
    tags: {
      type: [String],
      default: [],
    },

    media: {
      type: [
        {
          url: { type: String, required: true },
          type: { type: String, enum: ["image", "video"], required: true },
          caption: { type: String, default: "" },
        },
      ],
      default: [],
    },

    event: {
      title: String,
      startDate: Date,
      endDate: Date,
      venue: String,
      description: String,
    },

    article: {
      title: String,
      body: String,
    },

    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    viewers: [{ type: Schema.Types.ObjectId, ref: "User" }],

    commentsOff: {
      type: Boolean,
      default: false,
    },

    commentCount: {
      type: Number,
      default: 0,
    },
    moderationStatus: {
      type: String,
      enum: ["active", "hidden", "deleted", "ignore"],
      default: "active",
    },
  },
  { timestamps: true },
);

const BlogV2 = mongoose.model<IBlogDocument>("BlogV2", blogSchema);
export default BlogV2;
