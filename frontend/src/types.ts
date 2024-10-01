export interface Question {
    _id: string;
    question: string;
    options: string[];
    answer: string;
}

export interface LeaderboardUser {
    userId: string;
    username: string;
    score: number;
}