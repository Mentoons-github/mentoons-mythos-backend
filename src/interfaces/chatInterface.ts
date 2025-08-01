import mongoose from "mongoose";

export interface IChat {
    group:string,
    sender:mongoose.Types.ObjectId,
    message:string
}