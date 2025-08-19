import { ICareer } from "../interfaces/careerInterface";
import Career from "../models/careerModel";
import CustomError from "../utils/customError";

export const applyCareer = async(datas:ICareer) => {
    console.log(datas)
    const {name, email, mobileNumber, resume, position} = datas

    const alreadyApplied =await Career.findOne({email})
    if(alreadyApplied) {
        throw new CustomError("You already applied for this job",400)
    }

    return await Career.create({
        name,
        email,
        mobileNumber,
        resume,
        position
    })
}