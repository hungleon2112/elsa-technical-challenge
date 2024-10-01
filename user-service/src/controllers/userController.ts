import { Request, Response } from 'express';
import * as userService from '../services/userService';

// POST register
export const registerUser = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        await userService.registerUser(username, password);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// POST login
export const loginUser = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        const { token, userId } = await userService.loginUser(username, password);
        res.json({ message: 'Login successful', token, userId }); 
    } catch (error) {
        console.error('Login error:', error);
        res.status(401).json({ message: error }); 
    }
};

// Get users by an array of user IDs
export const getUsersByIds = async (req: Request, res: Response) => {
    const { userIds } = req.body; 

    try {
        const users = await userService.getUsersByIds(userIds); 
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
