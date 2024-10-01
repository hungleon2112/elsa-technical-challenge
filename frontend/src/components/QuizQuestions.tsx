import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { isAuthenticated } from '../utils/auth'; 
import {Question, LeaderboardUser} from '../types';
import 'bootstrap/dist/css/bootstrap.min.css';

const QuizQuestions: React.FC = () => {
    const { quizId } = useParams<{ quizId: string }>();
    const navigate = useNavigate(); 
    const [questions, setQuestions] = useState<Question[]>([]);
    const [userScore, setUserScore] = useState(0);
    const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
    const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string | null }>({});
    const socket = io(process.env.REACT_APP_REALTIME_SERVICE_URL);

    const token = localStorage.getItem('token');
    const userId = token ? JSON.parse(atob(token.split('.')[1])).userId : 'currentUserId';

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login');
        }{
            const fetchQuestions = async () => {
                try {
                    const response = await axios.get(`${process.env.REACT_APP_QUIZ_SERVICE_URL}/api/quizzes/${quizId}`);
                    setQuestions(response.data.questions);
                } catch (error) {
                    console.error('Error fetching questions:', error);
                }
            };
    
            const fetchUserAnswers = async () => {
                try {
                    const response = await axios.get(`${process.env.REACT_APP_QUIZ_SERVICE_URL}/api/quizzes/${quizId}/answers`, {
                        headers: {
                            Authorization: `Bearer ${token}` 
                        }
                    });
                    const answers = response.data;
                    const mappedAnswers = answers.reduce((acc: { [key: string]: string | null }, answer: { questionId: string; selectedAnswer: string }) => {
                        acc[answer.questionId] = answer.selectedAnswer;
                        return acc;
                    }, {});
    
                    setSelectedAnswers(mappedAnswers); // Pre-select answers
                } catch (error) {
                    console.error('Error fetching user answers:', error);
                }
            };
    
            socket.connect();
            socket.emit('joinQuiz', { userId, quizId });
    
            // Listen for the quiz summary
            socket.on('quizSummary', (summary) => {
                console.log('Received quiz summary:', summary);
                setQuestions(summary.questions);

                const sortedLeaderboard = summary.leaderboard.sort((a: LeaderboardUser, b: LeaderboardUser) => b.score - a.score);
                setLeaderboard(sortedLeaderboard); 

                // Update userScore based on leaderboard
                const userLeaderboard = summary.leaderboard.find((user: LeaderboardUser) => user.userId === userId); 
                setUserScore(userLeaderboard ? userLeaderboard.score : 0); 
            });
    
            fetchQuestions();
            fetchUserAnswers();
    
            return () => {
                socket.disconnect();
                socket.off('quizSummary');
            };
        }

    }, [quizId, navigate]);

    const handleAnswer = async (questionId: string, selectedAnswer: string) => {
        const question = questions.find(q => q._id === questionId);
    
        if (question) {
            setSelectedAnswers(prev => ({ ...prev, [questionId]: selectedAnswer }));
    
            // Send selected answer to the quiz service
            await axios.post(`${process.env.REACT_APP_QUIZ_SERVICE_URL}/api/quizzes/${quizId}/answers`, {
                questionId,
                selectedAnswer,
            }, {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            });
            setTimeout(() => {
                //TODO: This must be enhanced, should not send emit here, should use real-time service to listen the message from RabbitMQ then broadcast back to Client
                socket.emit('joinQuiz', { userId, quizId });
            }, 200);
        }
    };

    const handleBack = () => {
        navigate('/quizzes'); 
    };
    

    const handleLogout = () => {
        localStorage.removeItem('token'); 
        navigate('/login'); 
    };

    return (
        <div className="container mt-5">
            <button style={{marginRight: 30}} className="btn btn-danger mb-3" onClick={handleLogout}>Logout</button> 
            <button className="btn btn-secondary mb-3" onClick={handleBack}>Back to Quiz Selection</button>
            <h2>Quiz Questions(DEV Mode: Option A is the correct answer for all questions)</h2>
            <h3>Leaderboard</h3>
            <ul className="list-group mb-3">
                {leaderboard.map(user => (
                    <li key={user.userId} className="list-group-item">
                        {user.username}: {user.score}
                    </li>
                ))}
            </ul>
            <h3>Current Score: {userScore}</h3>
            <div>
                {questions.map((q) => (
                    <div key={q._id} className="mb-4">
                        <p>{q.question}</p>
                        {q.options.map((option) => (
                            <button 
                                key={option} 
                                onClick={() => handleAnswer(q._id, option)} 
                                disabled={!!selectedAnswers[q._id]} // Disable if already answered
                                className={`btn ${selectedAnswers[q._id] === option ? 'btn-success' : 'btn-dark'} me-2`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuizQuestions;
