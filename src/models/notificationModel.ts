import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "receiverModel",
      required: true,
    },
    receiverModel: {
      type: String,
      enum: ["Admin", "Employee"],
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
    message: { type: String, required: true },
    type: { type: String },
    isRead: { type: Boolean, default: false },
    relatedId: { type: mongoose.Schema.Types.ObjectId, ref: "EmployeeTasks" },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
