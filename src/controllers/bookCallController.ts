import catchAsync from "../utils/cathAsync";
import *as bookCallService from '../services/bookCallServices'

export const availbleSlots = catchAsync(async(req,res)=>{
    const {date, type} = req.query
    const slots = await bookCallService.availbleSlots(date, type)
    res.status(200).json({success:true, message:"fetched available slots", slots})
})

export const bookSlot = catchAsync (async(req,res) => {
    const booking = await bookCallService.bookSlot(req.body)
    res.status(200).json({message:"Booked your slot", booking})
})