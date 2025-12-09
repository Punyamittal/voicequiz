export interface User {
  id: string;
  email: string;
  password?: string;
  name: string;
  role: 'student' | 'admin';
  is_verified: boolean;
  otp?: string;
  otp_expiry?: string;
  created_at: string;
  updated_at: string;
}

export interface QuestionOption {
  text: string;
  isCorrect: boolean;
}

export interface QuestionTranslation {
  language: string;
  questionText: string;
  options: QuestionOption[];
}

export interface Question {
  id: string;
  question_number: number;
  translations: QuestionTranslation[];
  points: number;
  negative_points: number;
  created_at: string;
  updated_at: string;
}

export interface Answer {
  id: string;
  user_id: string;
  question_number: number;
  selected_option_index: number;
  is_correct: boolean;
  time_taken: number;
  points: number;
  speed_bonus: number;
  total_points: number;
  answered_at: string;
}

export interface QuizSession {
  id: string;
  user_id: string;
  start_time: string;
  end_time?: string;
  current_question: number;
  is_completed: boolean;
  total_score: number;
  total_correct: number;
  total_wrong: number;
  total_time: number;
  average_speed: number;
  accuracy: number;
  language: string;
  created_at: string;
  updated_at: string;
}

