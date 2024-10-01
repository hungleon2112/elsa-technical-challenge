import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import { isAuthenticated } from '../utils/auth';
import 'bootstrap/dist/css/bootstrap.min.css';

const QuizSelect: React.FC = () => {
    const [quizzes, setQuizzes] = useState([]);
    const navigate = useNavigate(); 

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login'); 
        }
    }, [navigate]);
    
    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_QUIZ_SERVICE_URL}/api/quizzes`);
                setQuizzes(response.data);
            } catch (error) {
                console.error('Error fetching quizzes:', error);
            }
        };

        fetchQuizzes();
    }, []);

    const handleQuizSelect = (quizId: string) => {
        navigate(`/quizzes/${quizId}`); 
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); 
        navigate('/login'); 
    };

    return (
        <div className="container mt-5">
            <button className="btn btn-danger mb-3" onClick={handleLogout}>Logout</button> 
            <h2>Select a Quiz</h2>
            <ul className="list-group">
                {quizzes.map((quiz: { _id: string; title: string }) => (
                    <li 
                        key={quiz._id} 
                        className="list-group-item list-group-item-action" 
                        style={{ cursor: 'pointer' }} 
                        onClick={() => handleQuizSelect(quiz._id)}
                    >
                        {quiz.title}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default QuizSelect;
