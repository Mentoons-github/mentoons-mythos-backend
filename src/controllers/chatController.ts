import catchAsync from "../utils/cathAsync";
import *as chatSevice from '../services/chatService'

export const getChats = catchAsync(async (req,res) => {
    const {groupId} = req.params
    const chats = await chatSevice.getChats(groupId)
    res.status(200).json({message:"Fetched this group messages", chats})
})