export interface Question {
    _id: string;
    question: string;
    options: string[];
    answer: string; 
}

export interface Score {
    userId: string;
    quizId: string;
    score: number;
}

export interface User {
    _id: string;
    username: string;
}

export interface LeaderboardUser {
    userId: string;
    username: string;
    score: number;
}

export interface Quiz {
    _id: string;
    title: string;
    questions: Question[];
}
