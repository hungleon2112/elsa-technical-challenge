import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET || 'BT2eX2HJ3c71FNJ1HGbCWoH37rwU6LxLTwRhU4A60oPCeX16dhycIyqH3bWac2T7', (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        req.body.userId = (decoded as { userId: string }).userId; 
        next();
    });
};

export default authMiddleware;
