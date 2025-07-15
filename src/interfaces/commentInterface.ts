import { Types } from "mongoose";

export interface IComment {
  blogId: Types.ObjectId;
  userId: Types.ObjectId;
  username: string;
  profile:string;
  comment: string;
}
