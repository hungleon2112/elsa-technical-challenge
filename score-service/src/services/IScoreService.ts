import { IScore } from '../models/Score'; 

export interface IScoreService {
    getScoresByQuizId(quizId: string): Promise<IScore[]>;
    startRabbitMQListener(): Promise<void>;
}