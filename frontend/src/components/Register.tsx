import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); 

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post(`${process.env.REACT_APP_USER_SERVICE_URL}/api/users/register`, { username, password });
            alert('Registration successful! Please log in.');
            navigate('/login'); 
        } catch (error) {
            console.error('Registration failed:', error);
            alert('Registration failed!');
        }
    };

    return (
        <div className="container mt-5">
            <form onSubmit={handleRegister} className="form-signin">
                <h2 className="mb-3">Register</h2>
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
                <button type="submit" className="btn btn-primary">Register</button>
                <button type="button" className="btn btn-link" onClick={() => navigate('/login')}>Login</button> 
            </form>
        </div>
    );
};

export default Register;
