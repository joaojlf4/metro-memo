export type SubwayData = {
  [lineName: string]: string[];
};

export type LineColor = {
  name: string;
  color: string;
  textColor?: string;
};

export type QuizQuestion = {
  line: string;
  correctStation: string;
  options: string[];
};

export type QuizScore = {
  correct: number;
  wrong: number;
  total: number;
};

export type QuizSettings = {
  numberOfOptions: 3 | 4 | 5 | 6;
};

export type OrderQuizQuestion = {
  line: string;
  correctStation: string;
  options: string[];
  currentPosition: number;
};

export type OrderQuizPath = {
  station: string;
  isCorrect: boolean;
}[];
