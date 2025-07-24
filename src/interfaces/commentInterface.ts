import { Types } from "mongoose";

export interface IReply {
  userId: Types.ObjectId;
  username: string;
  profile?: string;
  replyText: string;
}

export interface IComment extends Document {
  blogId: Types.ObjectId;
  userId: Types.ObjectId;
  username: string;
  profile:string;
  comment: string;
  reply:IReply[]
}
