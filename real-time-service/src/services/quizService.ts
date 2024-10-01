import axios from 'axios';
import { LeaderboardUser, Quiz, Score, User, Question } from '../types/types'; 
import dotenv from 'dotenv';
dotenv.config();

export const fetchQuizSummary = async (quizId: string): Promise<{ title: string; questions: Question[]; leaderboard: LeaderboardUser[] }> => {
    try {
        const quizResponse = await axios.get<Quiz>(`${process.env.QUIZ_SERVICE_URL}/api/quizzes/${quizId}`);
        const scoresResponse = await axios.get<Score[]>(`${process.env.SCORE_SERVICE_URL}/api/scores?quizId=${quizId}`);
        const userIds = scoresResponse.data.map(score => score.userId); 
        const usersResponse = await axios.post<User[]>(`${process.env.USER_SERVICE_URL}/api/users/ids`, { userIds });

        const quiz = quizResponse.data;
        const scores = scoresResponse.data;
        const users = usersResponse.data;

        const leaderboard: LeaderboardUser[] = scores.map(score => {
            const user = users.find((user: User) => user._id === score.userId); 
            return {
                userId: score.userId,
                username: user ? user.username : 'Unknown User',
                score: score.score
            };
        });

        return {
            title: quiz.title,
            questions: quiz.questions,
            leaderboard
        };
    } catch (error) {
        console.error('Error fetching summary:', error);
        throw new Error('Server error');
    }
};
