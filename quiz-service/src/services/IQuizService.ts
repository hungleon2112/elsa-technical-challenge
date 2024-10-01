import { IQuiz } from '../models/Quiz'; 
import { IAnswer } from '../models/Answer'; 

export interface IQuizService {
    fetchAllQuizzes(): Promise<IQuiz[]>;
    fetchQuizById(id: string): Promise<IQuiz | null>;
    checkAnswerAndUpdateScore(quizId: string, questionId: string, selectedAnswer: string, userId: string): Promise<boolean>;
    fetchUserAnswers(userId: string, quizId: string): Promise<IAnswer[]>;
}