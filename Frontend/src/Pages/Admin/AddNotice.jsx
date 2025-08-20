import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/api';
import './Admin.css';

const AddNotice = () => {
    const [title, setTitle] = useState('');
    const [details, setDetails] = useState('');
    const [date, setDate] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const adminData = JSON.parse(localStorage.getItem('admin'));
    const adminId = adminData ? adminData.id : null;

    // Set the default date to today when the component loads
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        setDate(today);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!adminId) {
            setError("You must be logged in to create a notice.");
            return;
        }

        try {
            await api.post('/notices', {
                title,
                details,
                date,
                admin: adminId,
            });

            setSuccess('Notice has been posted successfully!');
            // Clear form
            setTitle('');
            setDetails('');
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to post notice.';
            setError(message);
            console.error('Error creating notice:', err.response || err);
        }
    };

    return (
        <div className="admin-page-container">
            <div className="admin-form-container">
                <h1>Post a New Notice</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Notice Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <textarea
                        placeholder="Notice Details"
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        required
                        rows="6"
                        style={{ width: '100%', padding: '12px', marginBottom: '1rem', border: '1px solid #ced4da', borderRadius: '4px', resize: 'vertical' }}
                    ></textarea>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                    <button type="submit">Post Notice</button>
                </form>
                {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
                {success && <p style={{ color: 'green', marginTop: '1rem' }}>{success}</p>}
                <p style={{ marginTop: '1.5rem' }}>
                    <Link to="/hod">Back to Dashboard</Link>
                </p>
            </div>
        </div>
    );
};

export default AddNotice;