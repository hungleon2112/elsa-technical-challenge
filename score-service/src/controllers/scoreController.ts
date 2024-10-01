import { Request, Response } from 'express';
import scoreService from '../services/scoreService';

export const getScoresByQuizId = async (req: Request, res: Response) => {
    const { quizId } = req.query;

    if (!quizId || Array.isArray(quizId)) {
        return res.status(400).json({ message: 'quizId is required and must be a string' });
    }

    try {
        const scores = await scoreService.getScoresByQuizId(quizId as string); 
        res.status(200).json(scores);
    } catch (error) {
        console.error('Error fetching scores:', error);
        res.status(500).json({ message: 'Server error' });
    }
};