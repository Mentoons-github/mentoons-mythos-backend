import catchAsync from "../utils/cathAsync";
import *as careerServices from '../services/careerServices'

export const applyCareer = catchAsync(async(req, res)=> {
    const apply = await careerServices.applyCareer(req.body)
    res.status(201).json({message:"You application successfully submited"})
})