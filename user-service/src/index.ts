import express from 'express';
import cors from 'cors'; 
import dotenv from 'dotenv';
import connectDB from './config/db';
import userRoutes from './routes/userRoutes';

dotenv.config();
const app = express();
// Use CORS middleware
app.use(cors({
    origin: ['http://localhost:3005', process.env.FRONTEND_URL || '', process.env.REALTIME_SERVICE_URL || ''] , 
    methods: ['GET', 'POST'], 
    credentials: true, 
}));
connectDB();

app.use(express.json());
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`User Service running on port ${PORT}`);
});
