import mongoose, { Schema } from "mongoose";
import { IReport } from "../interfaces/reportInterface";

const reportSchema: Schema = new Schema <IReport>(
  {
    from: {
      type: String,
      required: true,
    },
    fromId: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Report = mongoose.model<IReport>("Report", reportSchema);

export default Report;
