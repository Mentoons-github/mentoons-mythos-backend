import { Server, Socket } from "socket.io";
import Chat from "../models/chatModel";
import User from "../models/userModel";

export const setupSocket = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log(`🟢 Socket connected: ${socket.id}`);

    socket.on("join-group", (groupId) => {
      socket.join(groupId);
      console.log(`🔗 Socket ${socket.id} joined group ${groupId}`);
    });

    socket.on("send-group-message", async ({ groupId, message, senderId }) => {
      try {
        const user = await User.findById(senderId).select(
          "firstName lastName profilePicture"
        );

        if (!user) {
          console.log("❌ User not found");
          return;
        }

        io.to(groupId).emit("receive-group-message", {
          message,
          sender: {
            _id: senderId,
            firstName: user.firstName,
            lastName: user.lastName,
            profilePicture: user.profilePicture,
          },
          groupId,
          createdAt: new Date(),
        });

        const chat = await Chat.create({
          group: groupId,
          sender: senderId, 
          message,
        });

        console.log("✅ Chat saved:", chat);
      } catch (error) {
        console.error("🔥 Error in send-group-message:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log(`🔴 Socket disconnected: ${socket.id}`);
    });
  });
};
