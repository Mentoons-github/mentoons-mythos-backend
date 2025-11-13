import catchAsync from "../utils/cathAsync";
import *as CareerGpsService from '../services/CareerGpsService'

export const submitCareerGps = catchAsync(async(req,res) => {
    const userId = req.user._id
    const careerGpsDetails = await CareerGpsService.submitCareerGps(userId, req.body)
    res.status(201).json({message:"Successfully submitted Career GPS form", careerGpsDetails})
})