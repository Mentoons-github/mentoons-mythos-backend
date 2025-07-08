import catchAsync from "../utils/cathAsync";
import userAuthJoi from "../validations/userValidation";
import *as authServices from '../services/authServices'

export const registerUser = catchAsync(async(req,res)=> {
    const {value,error} = userAuthJoi.validate(req.body)
    const user = await authServices.registerUser(value,error)
    res.status(201).json({message:"Registration Successfull", user})
})  

export const loginUser = catchAsync(async(req,res) => {
    const user = await authServices.loginUser(req.body)
    return res.status(200).json({message:"Login Successfull",user})

})