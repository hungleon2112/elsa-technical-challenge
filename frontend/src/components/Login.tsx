import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import 'bootstrap/dist/css/bootstrap.min.css';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); 

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_USER_SERVICE_URL}/api/users/login`, { username, password });
            alert('Login successful!');
            localStorage.setItem('token', response.data.token);
            navigate('/quizzes'); 
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed!');
        }
    };

    return (
        <div className="container mt-5">
            <form onSubmit={handleLogin} className="form-signin">
                <h2 className="mb-3">Login</h2>
                <div className="mb-3">
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Username" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                    />
                </div>
                <div className="mb-3">
                    <input 
                        type="password" 
                        className="form-control" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
                <button type="button" className="btn btn-link" onClick={() => navigate('/')}>Register</button> 
            </form>
        </div>
    );
};

export default Login;
