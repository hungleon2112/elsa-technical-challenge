// src/services/quizService.ts
import Quiz, { IQuiz }  from '../models/Quiz';
import Answer, { IAnswer } from '../models/Answer';
import { getRabbitMQChannel } from '../common/rabbitMQ';
import { IQuizService } from './IQuizService';

class QuizService implements IQuizService {
    public async fetchAllQuizzes(): Promise<IQuiz[]> {
        return await Quiz.find();
    }

    public async fetchQuizById(id: string): Promise<IQuiz | null> {
        return await Quiz.findById(id);
    }

    public async checkAnswerAndUpdateScore(quizId: string, questionId: string, selectedAnswer: string, userId: string): Promise<boolean> {
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            throw new Error('Quiz not found');
        }

        const question = quiz.questions.find(q => q._id.toString() === questionId);
        if (!question) {
            throw new Error('Question not found');
        }

        // Check if the answer already exists
        const existingAnswer = await Answer.findOne({ quizId, questionId, userId });
        if (existingAnswer) {
            throw new Error('Answer already submitted for this question');
        }

        const isCorrect = question.answer === selectedAnswer;

        const answer = new Answer({
            quizId,
            questionId,
            selectedAnswer,
            userId
        });
        await answer.save();

        if (isCorrect) {
            const channel = getRabbitMQChannel();
            const scoreUpdate = { userId, quizId, score: 1 };
            channel.sendToQueue('score_updates', Buffer.from(JSON.stringify(scoreUpdate)));
        }

        return isCorrect;
    }

    public async fetchUserAnswers(userId: string, quizId: string): Promise<IAnswer[]> {
        return await Answer.find({ quizId, userId }).exec();
    }
}

export default new QuizService();
