import mongoose from "mongoose";

export interface IBlog {
    file:string,
    writerId:mongoose.Types.ObjectId,
    writer:string,
    title:string,
    description:string,
    tags:string[]
    likes?: mongoose.Types.ObjectId[];
}