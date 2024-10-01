import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types/token';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
        return res.sendStatus(401); 
    }

    jwt.verify(token, process.env.JWT_SECRET || 'BT2eX2HJ3c71FNJ1HGbCWoH37rwU6LxLTwRhU4A60oPCeX16dhycIyqH3bWac2T7', (err: any, user: any) => {
        if (err) return res.sendStatus(403); 
        req.body.userId = (user as JwtPayload).userId; 
        next(); 
    });
};
