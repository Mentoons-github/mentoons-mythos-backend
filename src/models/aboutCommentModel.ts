import mongoose from "mongoose";
import { AboutCommentI } from "../interfaces/about&newsletter";

interface IAboutCommentDocument extends AboutCommentI, Document {}

const aboutCommentSchema = new mongoose.Schema<IAboutCommentDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const AboutComment = mongoose.model<IAboutCommentDocument>(
  "AboutComment",
  aboutCommentSchema
);
export default AboutComment;
