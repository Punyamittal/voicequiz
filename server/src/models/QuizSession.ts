import mongoose, { Schema, Document } from 'mongoose';

export interface IQuizSession extends Document {
  userId: mongoose.Types.ObjectId;
  startTime: Date;
  endTime?: Date;
  currentQuestion: number;
  isCompleted: boolean;
  totalScore: number;
  totalCorrect: number;
  totalWrong: number;
  totalTime: number; // in seconds
  averageSpeed: number; // average time per question
  accuracy: number; // percentage
  language: string;
}

const QuizSessionSchema = new Schema<IQuizSession>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  currentQuestion: { type: Number, default: 1 },
  isCompleted: { type: Boolean, default: false },
  totalScore: { type: Number, default: 0 },
  totalCorrect: { type: Number, default: 0 },
  totalWrong: { type: Number, default: 0 },
  totalTime: { type: Number, default: 0 },
  averageSpeed: { type: Number, default: 0 },
  accuracy: { type: Number, default: 0 },
  language: { type: String, default: 'en' }
});

export default mongoose.model<IQuizSession>('QuizSession', QuizSessionSchema);

