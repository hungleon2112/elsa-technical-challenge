import { Router } from 'express';
import { getScoresByQuizId } from '../controllers/scoreController';

const router = Router();

router.get('/', getScoresByQuizId); 


export default router;
