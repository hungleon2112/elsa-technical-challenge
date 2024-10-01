import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import scoreRoutes from './routes/scoreRoutes';
import amqp from 'amqplib';
import Score from './models/Score'; 
import ScoreService from './services/scoreService';

dotenv.config();
const app = express();

// Use CORS middleware
app.use(cors({
    origin: [process.env.FRONTEND_URL || '', process.env.REALTIME_SERVICE_URL || ''],
    methods: ['GET', 'POST'],
    credentials: true,
}));

// Connect to MongoDB
connectDB();

// Middleware to parse JSON requests
app.use(express.json());

// Score routes
app.use('/api/scores', scoreRoutes);

// Start RabbitMQ listener
const startRabbitMQListener = async () => {
    //await ScoreService.startRabbitMQListener(); // Call the startRabbitMQListener method from ScoreService
    try {
        await ScoreService.startRabbitMQListener(); // Call the startRabbitMQListener method from ScoreService
    } catch (error) {
        console.error('Failed to start RabbitMQ listener:', error);
        process.exit(1); // Exit the process with an error code
    }
};

// Start the RabbitMQ listener
startRabbitMQListener();

// Start the Express server
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`Score Service running on port ${PORT}`);
});
