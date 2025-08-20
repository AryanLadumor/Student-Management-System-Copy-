import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import './NoticeBoard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullhorn } from '@fortawesome/free-solid-svg-icons';

const NoticeBoard = () => {
    const [notices, setNotices] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const userData = JSON.parse(localStorage.getItem('student')) || JSON.parse(localStorage.getItem('teacher')) || JSON.parse(localStorage.getItem('admin'));

    useEffect(() => {
        if (!userData || !userData.admin) {
            // Redirect to a safe page if no user or admin info is found
            navigate('/select-role');
            return;
        }

        const fetchNotices = async () => {
            try {
                const adminId = userData.admin._id || userData.admin;
                const response = await api.get(`/notices/admin/${adminId}`);
                setNotices(response.data);
            } catch (err) {
                setError('Failed to fetch notices.');
            }
        };

        fetchNotices();
    }, [userData, navigate]);

    return (
        <div className="notice-board-container">
            <h1><FontAwesomeIcon icon={faBullhorn} /> Notice Board</h1>
            {error && <p className="error-message">{error}</p>}
            <div className="notice-list">
                {notices.length > 0 ? (
                    notices.map(notice => (
                        <div key={notice._id} className="notice-card">
                            <h2 className="notice-title">{notice.title}</h2>
                            <p className="notice-details">{notice.details}</p>
                            <p className="notice-date">Posted on: {new Date(notice.date).toLocaleDateString()}</p>
                        </div>
                    ))
                ) : (
                    <p>No notices have been posted yet.</p>
                )}
            </div>
        </div>
    );
};

export default NoticeBoard;