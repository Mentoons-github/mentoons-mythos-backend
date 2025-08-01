import { IAssessment } from "../interfaces/AssessmentInterface";
import Assessment from "../models/assessmentModel";
import CustomError from "../utils/customError";

export const assessmentSubmission = async(userId:string,details:IAssessment) => {
    if(!userId) {
        throw new CustomError("User not found", 404)
    }
    console.log(details,'detaols')
    return await Assessment.create({
        userId:userId,
        assessmentName:details.assessmentName,
        assessmentType:details.assessmentType,
        submissions:details.submissions
    })

}