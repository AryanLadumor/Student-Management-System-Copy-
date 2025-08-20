import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/api';
import './ViewComplaints.css';

const ViewComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const studentData = JSON.parse(localStorage.getItem('student'));

    useEffect(() => {
        if (!studentData || !studentData._id) {
            navigate('/student/login');
            return;
        }

        const fetchComplaints = async () => {
            try {
                const res = await api.get(`/complain/student/${studentData._id}`);
                setComplaints(res.data);
            } catch (err) {
                if (err.response && err.response.status === 404) {
                    setComplaints([]); // No complaints found
                } else {
                    setError('Failed to fetch your complaints.');
                }
            }
        };

        fetchComplaints();
    }, [studentData?._id, navigate]);

    const getStatusClass = (status) => {
        if (status === 'Resolved') return 'status-resolved';
        if (status === 'Rejected') return 'status-rejected';
        return 'status-pending';
    };

    return (
        <div className="student-complaints-container">
            <div className="student-complaints-header">
                <h1>My Complaints</h1>
                <Link to="/student/complain" className="new-complain-btn">
                    File a New Complaint
                </Link>
            </div>

            {error && <p className="error-message">{error}</p>}

            <div className="complaints-list">
                {complaints.length > 0 ? (
                    complaints.map(complain => (
                        <div key={complain._id} className="complain-card">
                            <div className="complain-card-header">
                                <h3>{complain.title}</h3>
                                <span className={`status-badge ${getStatusClass(complain.status)}`}>
                                    {complain.status}
                                </span>
                            </div>
                            <p className="complain-message">{complain.message}</p>
                            {complain.response && (
                                <div className="admin-response">
                                    <strong>Admin Response:</strong>
                                    <p>{complain.response}</p>
                                </div>
                            )}
                            <div className="complain-card-footer">
                                <span>Submitted on: {new Date(complain.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-complaints">
                        <p>You haven't submitted any complaints yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewComplaints;