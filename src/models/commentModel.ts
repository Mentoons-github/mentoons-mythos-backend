import mongoose, { Schema } from "mongoose";
import { IComment, IReply } from "../interfaces/commentInterface";

const replySchema = new Schema<IReply>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    replyText: {
      type: String,
      required: true,
    },
    profile: {
      type: String
    }
  },
  { timestamps: true }
);

const commentSchema = new Schema<IComment>(
  {
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    profile:{
        type:String
    },
    reply:[replySchema]
  },
  { timestamps: true }
);

const Comment = mongoose.model<IComment>("Comment", commentSchema);
export default Comment;
