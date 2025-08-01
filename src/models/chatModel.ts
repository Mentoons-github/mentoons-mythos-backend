import mongoose, { Schema } from "mongoose";
import { IChat } from "../interfaces/chatInterface";

export interface IChatDocument extends IChat, Document {}

const chatSchema = new mongoose.Schema<IChatDocument>(
  {
    group: {
      type:String ,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
},
  {
    timestamps: true,
  }
);

const Chat = mongoose.model<IChatDocument>("Chat", chatSchema);
export default Chat;
