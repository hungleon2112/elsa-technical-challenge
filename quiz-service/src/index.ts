import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; 
import connectDB from './config/db';
import quizRoutes from './routes/quizRoutes';
import { connectRabbitMQ } from './common/rabbitMQ';

dotenv.config();
const app = express();
// Use CORS middleware
app.use(cors({
    origin: ['http://localhost:3005', process.env.FRONTEND_URL || '', process.env.REALTIME_SERVICE_URL || ''], 
    methods: ['GET', 'POST'], 
    credentials: true, 
}));
connectDB();

connectRabbitMQ()
    .then(() => {
        console.log('Connected to RabbitMQ');
    })
    .catch(error => {
        console.error('Error connecting to RabbitMQ:', error);
        process.exit(1); 
    });

app.use(express.json());
app.use('/api/quizzes', quizRoutes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Quiz Service running on port ${PORT}`);
});
