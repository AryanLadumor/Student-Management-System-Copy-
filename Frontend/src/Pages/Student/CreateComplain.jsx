import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/api';
import './CreateComplain.css';

const CreateComplain = () => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const studentData = JSON.parse(localStorage.getItem('student'));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!studentData || !studentData._id || !studentData.admin) {
            setError("You must be logged in to submit a complaint.");
            return;
        }

        try {
            await api.post('/complain/create', {
                title,
                message,
                student: studentData._id, // Corrected from studentData.id
                admin: studentData.admin._id,
            });

            setSuccess('Your complaint has been submitted successfully!');
            setTimeout(() => {
                navigate('/student');
            }, 2000);

        } catch (err) {
            const errorMessage = err.response?.data?.msg || 'Failed to submit complaint.';
            setError(errorMessage);
        }
    };

    return (
        <div className="complain-page-container">
            <div className="complain-form-container">
                <h1>File a Complaint</h1>
                <p>Please provide details about your issue below. We will get back to you shortly.</p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Subject of your complaint"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <textarea
                        placeholder="Describe your issue in detail"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        rows="8"
                    ></textarea>
                    <button type="submit">Submit Complaint</button>
                </form>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
                <p style={{ marginTop: '1.5rem' }}>
                    <Link to="/student">Back to Dashboard</Link>
                </p>
            </div>
        </div>
    );
};

export default CreateComplain;