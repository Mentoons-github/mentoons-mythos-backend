import mongoose from "mongoose";
import { IBadge } from "../interfaces/badgeInterface";

export interface IBadgeDocument extends IBadge, Document {}

const badgeSchema = new mongoose.Schema<IBadgeDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    criteria: {
      action: {
        type: String,
        required: true,
      },
      field: {
        type: String,
        enum: ["count", "days", "pages"],
        default: "count",
      },
      operator: {
        type: String,
        enum: [">=", "<=", ">", "<", "=="],
        default: ">=",
      },
      value: {
        type: Number,
        default: 1,
      },
    },
    animation: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    xp: {
      type: Number,
    },
  },
  {
    timestamps: true,
    minimize: false,
  },
);

const Badge = mongoose.model<IBadgeDocument>("Badge", badgeSchema);
export default Badge;
