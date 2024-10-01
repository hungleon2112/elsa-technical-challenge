import { Server } from 'socket.io';
import http from 'http';
import { fetchQuizSummary } from './quizService'; 
import dotenv from 'dotenv';

dotenv.config();

const createSocketServer = (server: http.Server) => {
    const io = new Server(server,{
        cors: {
            origin: ['http://localhost:3005', process.env.FRONTEND_URL || ''], 
            methods: ['GET', 'POST'],
            allowedHeaders: ['Content-Type'],
            credentials: true 
        }
    });

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);
    
        socket.on('joinQuiz', async ({ userId, quizId }) => {
            console.log(`User ${userId} joined quiz ${quizId}`);
            
            // Join the room corresponding to the quizId
            socket.join(quizId);
            
            try {
                // Fetch quiz summary when a user joins
                const summary = await fetchQuizSummary(quizId);
                // Emit the quiz summary to all users in the room
                console.log("Summary: ", summary);
                io.to(quizId).emit('quizSummary', summary); // Emit to the room
            } catch (error) {
                console.error('Error fetching quiz summary:', error);
                socket.emit('error', { message: 'Failed to fetch quiz summary.' });
            }
        });
    
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });

    return io;
};

export default createSocketServer;
