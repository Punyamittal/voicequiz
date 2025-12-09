import { create } from 'zustand';

interface Question {
  questionNumber: number;
  question: string;
  options: { index: number; text: string }[];
  language: string;
  startTime: string;
  totalQuestions: number;
}

interface QuizState {
  currentQuestion: Question | null;
  language: string;
  setCurrentQuestion: (question: Question) => void;
  setLanguage: (language: string) => void;
}

export const useQuizStore = create<QuizState>((set) => ({
  currentQuestion: null,
  language: 'en',
  setCurrentQuestion: (question) => set({ currentQuestion: question }),
  setLanguage: (language) => set({ language })
}));

