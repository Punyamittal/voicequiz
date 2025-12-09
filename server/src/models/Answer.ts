import mongoose, { Schema, Document } from 'mongoose';

export interface IAnswer extends Document {
  userId: mongoose.Types.ObjectId;
  questionNumber: number;
  selectedOptionIndex: number;
  isCorrect: boolean;
  timeTaken: number; // in seconds
  points: number;
  speedBonus: number;
  totalPoints: number;
  answeredAt: Date;
}

const AnswerSchema = new Schema<IAnswer>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  questionNumber: { type: Number, required: true },
  selectedOptionIndex: { type: Number, required: true },
  isCorrect: { type: Boolean, required: true },
  timeTaken: { type: Number, required: true },
  points: { type: Number, required: true },
  speedBonus: { type: Number, default: 0 },
  totalPoints: { type: Number, required: true },
  answeredAt: { type: Date, default: Date.now }
});

AnswerSchema.index({ userId: 1, questionNumber: 1 }, { unique: true });

export default mongoose.model<IAnswer>('Answer', AnswerSchema);

