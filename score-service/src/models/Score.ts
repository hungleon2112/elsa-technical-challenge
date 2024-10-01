import mongoose, { Document, Schema } from 'mongoose';

export interface IScore extends Document {
    userId: string;
    quizId: string;
    score: number;
}

const ScoreSchema = new Schema<IScore>({
    userId: { type: String, required: true },
    quizId: { type: String, required: true },
    score: { type: Number, default: 0, required: true }
});

const Score = mongoose.model<IScore>('Score', ScoreSchema);
export default Score;
