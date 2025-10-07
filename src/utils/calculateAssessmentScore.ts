import {
  InitialAssessmentI,
  SubmissionsI,
} from "../interfaces/AssessmentInterface";

export const calculateScore = async (submissions: SubmissionsI[]) => {
  const optionScoreMap: Record<number, number> = {
    1: 5,
    2: 3,
    3: 1,
    4: 0,
  };
  const scores: Record<string, number> = {};
  submissions.forEach((submission) => {
    const { assessmentName, optionNo } = submission;

    const score = optionScoreMap[optionNo] || 0;
    if (!scores[assessmentName]) {
      scores[assessmentName] = 0;
    }

    scores[assessmentName] += score;
  });

  console.log(scores,'scoressss')

  return {topScores:getTopIntelligences(scores),scores};
};

//
function getTopIntelligences(scores: Record<string, number>) {
  // let max = -1
  // let intelligence = ''

  // for(const [key, value] of Object.entries(data)){
  //     if(value > max){
  //         max = value
  //         intelligence = key
  //     }
  // }
  // return intelligence

  const maxScore = Math.max(...Object.values(scores));
  return Object.keys(scores).filter((key) => scores[key] === maxScore);
}
