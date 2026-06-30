import { Types } from "mongoose";

export interface IReply {
  commentId: Types.ObjectId;
  userId: Types.ObjectId;
  replyToUserId: Types.ObjectId;
  replyText: string;
}

export interface IComment extends Document {
  blogId: Types.ObjectId;
  userId: Types.ObjectId;
  comment: string;
  replyCount: number;
  moderationStatus: "active" | "hidden" | "deleted" | "ignore";
}
