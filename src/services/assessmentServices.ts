import {
  IAssessment,
  InitialAssessmentI,
} from "../interfaces/AssessmentInterface";
import Assessment from "../models/assessmentModel";
import AssessmentQuestion from "../models/assessmentQuestionModel";
import InitialAssessment from "../models/initialAssessmentModel";
import User from "../models/userModel";
import { calculateScore } from "../utils/calculateAssessmentScore";
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
  return { name, type };
};

//getAssessment question
export const getAssessmentQuestion = async (name: string) => {
  const questions = await AssessmentQuestion.findOne({ name });
  return questions;
};

//get all assessments
export const getAllAssessments = async (
  limit: number,
  page: number,
  sort: string,
  search?: string
) => {
  const skip = (page - 1) * limit;
  const sortOrder = sort === "newest" ? -1 : 1;
  const query: any = {};
  if (search) {
    const users = await User.find({
      $or: [
        { email: { $regex: search, $options: "i" } },
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
      ],
    }).select("_id");
    const userIds = users.map((u) => u._id);
    query.$or = [
      { assessmentType: { $regex: search, $options: "i" } },
      { assessmentName: { $regex: search, $options: "i" } },
      { userId: { $in: userIds } },
    ];
  }
  const details = await Assessment.find(query)
    .select("assessmentName assessmentType userId")
    .populate("userId", "firstName lastName profilePicture email")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: sortOrder });

  const total = await Assessment.countDocuments(query);
  return { details, page, totalPages: Math.ceil(total / limit) };
};

//get single submissions
export const getSingleSubmission = async (submissionId: string) => {
  const submission = await Assessment.findById(submissionId).lean();
  if (!submission) return null;
  const assessment = await AssessmentQuestion.findOne({
    name: submission.assessmentName,
  }).lean();
  if (!assessment) return submission;
  const detailedAnswers = submission.submissions.map((ans: any) => {
    const questionObj = assessment.questions[ans.questionNumber - 1]; // index-based
    return {
      ...ans,
      question: questionObj?.question,
      options: questionObj?.options,
    };
  });

  return detailedAnswers;
};

// fetch initial assessment questiions
export const getFirstAssessmentQuestions = async () => {
  const allAssessments = await AssessmentQuestion.find().lean();

  const selectedQuestions = allAssessments.flatMap((assessment) => {
    const shuffled = assessment.questions
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    return shuffled.map((q: any, index: number) => ({
      name: assessment.name,
      type: assessment.type,
      questionNumber: index + 1,
      question: q.question,
      options: q.options,
    }));
  });

  const fullyShuffled = selectedQuestions.sort(() => Math.random() - 0.5);
  return fullyShuffled;
};

// submt initial assessments
export const initialSubmission = async (
  details: InitialAssessmentI,
  userId: string
) => {
  const { assessmentType, submissions } = details;
  console.log(submissions, "submissions");
  const { scores, topScores } = await calculateScore(submissions);
  console.log(topScores, "scoressss");
  const newAssessment = await InitialAssessment.create({
    userId,
    assessmentType,
    submissions,
    intelligenceTypes: topScores,
    scores,
  });

  const user = await User.findById(userId);
  if (user) {
    user.takeInitialAssessment = true;
    user.intelligenceTypes = topScores;
    await user.save();
  }

  return newAssessment;
};

export const getInitialAssessmentSubmissions = async (
  limit: number,
  page: number,
  sort: string,
  search?: string
) => {
  const skip = (page - 1) * limit;
  const sortOrder = sort === "newest" ? -1 : 1;
  const query: any = {};
  if (search) {
    const users = await User.find({
      $or: [
        { email: { $regex: search, $options: "i" } },
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
      ],
    }).select("_id");
    const userIds = users.map((u) => u._id);
    query.$or = [
      { assessmentType: { $regex: search, $options: "i" } },
      { userId: { $in: userIds } },
    ];
  }
  const details = await InitialAssessment.find(query)
    .populate("userId", "firstName lastName profilePicture email")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: sortOrder });
  const total = await InitialAssessment.countDocuments(query);
  return { details, page, totalPages: Math.ceil(total / limit) };
};

// get single intial assessment details
export const getSingleInitialAssessmentDetails = async (
  assessmentId: string
) => {
  if (!assessmentId) throw new CustomError("Plase give assessment id", 400);
  const details = await InitialAssessment.findById(assessmentId);
  return details;
};

// assessment submission delete
export const deleteAssessmentSubmission = async (assessmentId: string) => {
  if (!assessmentId) throw new CustomError("Assessment id needed", 400);
  const assessment = await Assessment.findByIdAndDelete(assessmentId);
  if (!assessment) throw new CustomError("Assessment not found", 404);
};

// initial assessment submission delete
export const deleteInitialAssessmentSubmission = async (
  assessmentId: string
) => {
  if (!assessmentId) throw new CustomError("Assessment id needed", 400);
  const assessment = await InitialAssessment.findByIdAndDelete(assessmentId);
  if (!assessment) throw new CustomError("Assessment not found", 404);
  const user = await User.findById(assessment?.userId);
  if (user) {
    user.intelligenceTypes = [];
    user.takeInitialAssessment = false;
    await user.save();
  }
};
