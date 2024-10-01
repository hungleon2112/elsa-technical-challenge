import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login'; 
import QuizSelect from './components/QuizSelect';
import QuizQuestions from './components/QuizQuestions';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Register />} />
                <Route path="/login" element={<Login />} /> 
                <Route path="/quizzes" element={<QuizSelect />} />
                <Route path="/quizzes/:quizId" element={<QuizQuestions />} />
            </Routes>
        </Router>
    );
};

export default App;
