import { Types } from "mongoose";

export interface IBlog {
    file:string,
    writerId:Types.ObjectId,
    writer:string,
    title:string,
    description:string,
    tags:string[]
}