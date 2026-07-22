import mongoose from "mongoose";
import { IProducts } from "../interfaces/productInterface";

const modelSchema = new mongoose.Schema<IProducts>(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    thumbnails: [
      {
        type: String,
        required: true,
      },
    ],
    pages: {
      type: Number,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    offerPrice: {
      type: Number,
    },
    description: {
      type: String,
      required: true,
    },
    data: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IProducts>("Product", modelSchema);
