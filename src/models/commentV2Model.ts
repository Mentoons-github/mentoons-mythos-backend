import mongoose, { Schema } from "mongoose";
import { IComment } from "../interfaces/commentInterface";

export interface ICommentDocument extends IComment, Document {}

const commentSchema = new Schema<IComment>(
  {
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogV2",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    moderationStatus: {
      type: String,
      enum: ["active", "hidden", "deleted", "ignore"],
      default: "active",
    },
  },
  { timestamps: true },
);

const CommentV2 = mongoose.model<ICommentDocument>("CommentV2", commentSchema);
export default CommentV2;
