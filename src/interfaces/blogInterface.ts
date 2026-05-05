import mongoose from "mongoose";

export interface IBlog {
  file: string;
  writerId: mongoose.Types.ObjectId;
  writer: string;
  title: string;
  description: string;
  tags: string[];
  likes?: mongoose.Types.ObjectId[];
  commentsOff: boolean;
  viewers: mongoose.Types.ObjectId[];
  searchTitle: string;
  searchWriter: string;
  searchTags: string[];
  commentCount: number;
}

export interface IBlogV2 {
  postType: "image" | "video" | "event" | "article" | "text";
  file: string;
  user: mongoose.Types.ObjectId;
  content: string;
  tags: string[];
  media?: {
    url: string;
    caption: string;
    type: "image" | "video";
  }[];
  event?: {
    startDate: string;
    endDate: string;
    venue: string;
    description: string;
  };
  article?: {
    title:string
    body: string;
  };
  likes?: mongoose.Types.ObjectId[];
  commentsOff: boolean;
  viewers: mongoose.Types.ObjectId[];
  commentCount: number;
}
