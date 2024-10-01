import { Request, Response } from 'express';
import quizService from '../services/quizService';
import { IQuestion } from '../models/Quiz';

export const getAllQuizzes = async (req: Request, res: Response) => {
    try {
        const quizzes = await quizService.fetchAllQuizzes();
        res.status(200).json(quizzes);
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

export const getQuizById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const quiz = await quizService.fetchQuizById(id);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        const sanitizedQuiz = {
            id: quiz._id,
            title: quiz.title,
            questions: quiz.questions.map((question: IQuestion) => ({
                _id: question._id,
                question: question.question,
                options: question.options,
                answer: '' // Exclude answer
            }))
        };

        res.status(200).json(sanitizedQuiz);
    } catch (error) {
        console.error('Error fetching quiz:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const submitAnswer = async (req: Request, res: Response) => {
    const { quizId } = req.params;
    const { questionId, selectedAnswer } = req.body;
    const userId = req.body.userId;

    try {
        const isCorrect = await quizService.checkAnswerAndUpdateScore(quizId, questionId, selectedAnswer, userId);
        res.status(201).json({ message: 'Answer submitted successfully', isCorrect });
    } catch (error) {
        console.error('Error submitting answer:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getUserAnswers = async (req: Request, res: Response) => {
    const userId = req.body.userId; 
    const { quizId } = req.params; 

    if (typeof userId !== 'string') {
        return res.status(400).json({ message: 'Invalid userId' });
    }
    if (typeof quizId !== 'string') {
        return res.status(400).json({ message: 'Invalid quizId' });
    }

    try {
        const answers = await quizService.fetchUserAnswers(userId, quizId); 
        res.status(200).json(answers);
    } catch (error) {
        console.error('Error fetching user answers:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
