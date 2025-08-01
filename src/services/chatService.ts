import Chat from "../models/chatModel";
import CustomError from "../utils/customError";

export const getChats = async (groupId: string) => {
  if (!groupId) {
    throw new CustomError("Group id is required", 400);
  }
  return await Chat.find({ group: groupId }).populate("sender", " firstName lastName profilePicture");
};
