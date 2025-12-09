import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestionOption {
  text: string;
  isCorrect: boolean;
}

export interface IQuestionTranslation {
  language: string;
  questionText: string;
  options: IQuestionOption[];
}

export interface IQuestion extends Document {
  questionNumber: number;
  translations: IQuestionTranslation[];
  points: number;
  negativePoints: number;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionOptionSchema = new Schema<IQuestionOption>({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, required: true }
});

const QuestionTranslationSchema = new Schema<IQuestionTranslation>({
  language: { type: String, required: true },
  questionText: { type: String, required: true },
  options: [QuestionOptionSchema]
});

const QuestionSchema = new Schema<IQuestion>({
  questionNumber: { type: Number, required: true, unique: true },
  translations: [QuestionTranslationSchema],
  points: { type: Number, default: 4 },
  negativePoints: { type: Number, default: 1 }
}, {
  timestamps: true
});

export default mongoose.model<IQuestion>('Question', QuestionSchema);

