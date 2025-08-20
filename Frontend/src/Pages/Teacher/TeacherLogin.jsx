import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/api';
import '../Admin/Admin.css'; // Reusing the admin styles for consistency

const TeacherLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await api.post('/teachers/login', {
                email,
                password,
            });
            
            const { token, teacher } = response.data;
            
            // Store teacher info and token
            localStorage.setItem('token', token);
            localStorage.setItem('teacher', JSON.stringify(teacher));
            
            navigate('/teacher/dashboard');

        } catch (err) {
            const message = err.response?.data?.message || 'Login failed. Please check your credentials.';
            setError(message);
            console.error('Teacher login error:', err.response || err);
        }
    };

    return (
        <div className="admin-page-container">
            <div className="admin-form-container">
                <h1>Teacher Login</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Login</button>
                </form>
                {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
                 <p style={{ marginTop: '1.5rem' }}>
                    <Link to="/select-role">Back to Role Selection</Link>
                </p>
            </div>
        </div>
    );
};

export default TeacherLogin;