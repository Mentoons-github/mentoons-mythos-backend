import catchAsync from "../utils/cathAsync";
import *as blogServices from '../services/blogServices'

export const createBlog = catchAsync(async(req,res) => {
    const blog = await blogServices.createBlog(req.body, req.user._id)
    res.status(201).json({message:"Blog Created",blog})
})

export const fetchBlog = catchAsync(async(req,res) => {
    const blogs = await blogServices.fetchBlog()
    res.status(200).json({message:"Successfully fetched Blogs", blogs})
})