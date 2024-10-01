import express from 'express';
import { registerUser, loginUser, getUsersByIds } from '../controllers/userController'; 
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

// POST register
router.post('/register', registerUser);

// POST login
router.post('/login', loginUser); 


router.post('/ids', getUsersByIds);

export default router;
