
export interface MultipleChoiceQuestion {
  id: number;
  type: 'multiple-choice';
  question: string;
  options: string[];
  answer: string;
}

export interface TrueFalseStatement {
  id: string; // 'a', 'b', 'c', 'd'
  text: string;
  answer: boolean;
}

export interface TrueFalseQuestion {
  id: number;
  type: 'true-false';
  context: string;
  statements: TrueFalseStatement[];
}

export type QuizQuestion = MultipleChoiceQuestion | TrueFalseQuestion;
