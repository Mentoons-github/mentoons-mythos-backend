export interface IQuizQuestions {
  question: string;
  options: string[];
  answer: string;
}

export interface IQuiz {
  category: string;
  questions: IQuizQuestions[];
}
