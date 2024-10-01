import mongoose, { Document, Schema } from 'mongoose';

export interface IAnswer {
    quizId: string;
    questionId: string;
    selectedAnswer: string;
    userId: string;
}

const AnswerSchema = new Schema<IAnswer>({
    quizId: { type: String, required: true },
    questionId: { type: String, required: true },
    selectedAnswer: { type: String, required: true },
    userId: { type: String, required: true }
});

// Export the Answer model and type
const AnswerModel = mongoose.model<IAnswer>('Answer', AnswerSchema);
export default AnswerModel;