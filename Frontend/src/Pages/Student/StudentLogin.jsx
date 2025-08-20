import React ,  { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/api';
import '../Admin/Admin.css'; // Reusing admin styles for consistency

const StudentLogin = () => {
    const [institutename, setInstitutename] = useState('');
    const [rollnumber, setRollnumber] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await api.post('/students/login', {
                institutename,
                rollnumber,
                password,
            });
            
            const { token, student } = response.data;
            
            // Store student info and token
            localStorage.setItem('token', token);
            localStorage.setItem('student', JSON.stringify(student));
            
            navigate('/student'); // Navigate to student dashboard on successful login

        } catch (err) {
            const message = err.response?.data?.msg || 'Login failed. Please check your credentials.';
            setError(message);
            console.error('Student login error:', err.response || err);
        }
    };

    return (
        <div className="admin-page-container">
            <div className="admin-form-container">
                <h1>Student Login</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Institute Name"
                        value={institutename}
                        onChange={(e) => setInstitutename(e.target.value)}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Roll Number"
                        value={rollnumber}
                        onChange={(e) => setRollnumber(e.target.value)}
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

export default StudentLogin;