import { IAssessment } from "../interfaces/AssessmentInterface";
import Assessment from "../models/assessmentModel";
import AssessmentQuestion from "../models/assessmentQuestionModel";
import CustomError from "../utils/customError";

export const assessmentSubmission = async (
  userId: string,
  details: IAssessment
) => {
  if (!userId) {
    throw new CustomError("User not found", 404);
  }
  console.log(details, "detaols");
  return await Assessment.create({
    userId: userId,
    assessmentName: details.assessmentName,
    assessmentType: details.assessmentType,
    submissions: details.submissions,
  });
};

//create assessment
export const createAssessment = async ({
  type,
  name,
  question,
  options,
}: {
  type: string;
  name: string;
  question: string;
  options: string[];
}) => {
  const existingAssessment = await AssessmentQuestion.findOne({ name });

  if (existingAssessment) {
    existingAssessment.questions.push({ question, options });
     await existingAssessment.save();
  } else {
     await AssessmentQuestion.create({
      type,
      name,
      questions: [{ question, options }],
    });
  }
  return {name, type}
};

//getAssessment question 
export const getAssessmentQuestion = async(name:string) => {
  const questions = await AssessmentQuestion.findOne({name})
  return questions
}

export const getAllAssessments = async () => {
  return Assessment.find()
    .select("assessmentName assessmentType userId") 
    .populate("userId", "firstName lastName profilePicture")
};

export const getSingleSubmission = async (submissionId: string) => {
  const submission = await Assessment.findById(submissionId).lean();

  if (!submission) return null;

  const assessment = await AssessmentQuestion.findOne({ name: submission.assessmentName }).lean();

  if (!assessment) return submission;

  const detailedAnswers = submission.submissions.map((ans: any) => {
    const questionObj = assessment.questions[ans.questionNumber - 1]; // index-based
    return {
      ...ans,
      question: questionObj?.question,
      options: questionObj?.options
    };
  });

  return detailedAnswers
};


