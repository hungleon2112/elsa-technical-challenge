import express from 'express';
import { getAllQuizzes, getQuizById, submitAnswer, getUserAnswers } from '../controllers/quizController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

// GET all quizzes
router.get('/', getAllQuizzes);

// GET quiz by ID
router.get('/:id', getQuizById);

// POST to submit an answer
router.post('/:quizId/answers', authenticateToken, submitAnswer); 

// Get list answer by User and Quiz
router.get('/:quizId/answers', authenticateToken, getUserAnswers);

export default router;
