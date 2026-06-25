import mongoose, { Schema } from "mongoose";
import { IBlock } from "../interfaces/reportInterface";

const blockSchema: Schema = new Schema<IBlock>(
  {
    blockedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    blockedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Block = mongoose.model<IBlock>("Block", blockSchema);

export default Block;
