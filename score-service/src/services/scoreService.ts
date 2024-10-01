import Score, {IScore} from '../models/Score'; 
import amqp from 'amqplib';
import dotenv from 'dotenv';
import { IScoreService } from './IScoreService';

dotenv.config();

class ScoreService implements IScoreService {
    public async getScoresByQuizId(quizId: string): Promise<IScore[]> {
        return await Score.find({ quizId }).exec();
    };
    
    
    public async startRabbitMQListener(): Promise<void> {
        try {
            const rabbitMQUrl = process.env.RABBITMQ_URL; 
    
            if (!rabbitMQUrl) {
                throw new Error('RABBITMQ_URL is not defined in .env file');
            }
    
            const connection = await amqp.connect(rabbitMQUrl); 
            const channel = await connection.createChannel();
            const queue = 'score_updates';
    
            await channel.assertQueue(queue); 
    
            channel.consume(queue, async (msg) => {
                if (msg) {
                    const { userId, quizId, score } = JSON.parse(msg.content.toString());
    
                    try {
                        // Logic to update the user's score in the database
                        await Score.updateOne(
                            { userId, quizId },
                            { $inc: { score } }, // Increment the score
                            { upsert: true } // Create a new score record if it doesn't exist
                        );
                        console.log(`Score updated for user ${userId} on quiz ${quizId}: ${score}`);
                    } catch (error) {
                        console.error('Error updating score:', error);
                    }
                    channel.ack(msg); 
                }
            });
        } catch (error) {
            console.error('Error connecting to RabbitMQ:', error);
            throw new Error('RabbitMQ channel not initialized. Call connectRabbitMQ first.');
        }
    };
}

export default new ScoreService();