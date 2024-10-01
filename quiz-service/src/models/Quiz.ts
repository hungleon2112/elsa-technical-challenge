import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestion {
    _id: mongoose.Types.ObjectId;
    question: string;
    options: string[];
    answer: string;
}

export interface IQuiz extends Document {
    title: string;
    questions: IQuestion[];
}

const QuestionSchema = new Schema<IQuestion>({
    question: { type: String, required: true },
    options: { type: [String], required: true },
    answer: { type: String, required: true },
});

const QuizSchema = new Schema<IQuiz>({
    title: { type: String, required: true },
    questions: { type: [QuestionSchema], required: true },
});

const QuizModel = mongoose.model<IQuiz>('Quiz', QuizSchema);
export default QuizModel;
