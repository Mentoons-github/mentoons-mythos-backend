import mongoose, { Schema } from "mongoose";
import { IReply } from "../interfaces/commentInterface";

export interface ICommentReplyDocument extends IReply, Document {}

const replySchema = new Schema<IReply>(
  {
    commentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CommentV2",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    replyToUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    replyText: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const CommentReply = mongoose.model<IReply>("CommentReply", replySchema);
export default CommentReply;
