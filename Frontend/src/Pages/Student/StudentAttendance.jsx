import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/api';
import './StudentAttendance.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarCheck, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const StudentAttendance = () => {
    const [attendance, setAttendance] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const studentData = JSON.parse(localStorage.getItem('student'));

    useEffect(() => {
        if (!studentData || !studentData._id) {
            navigate('/student/login');
            return;
        }

        const fetchAttendance = async () => {
            try {
                const response = await api.get(`/attendance/${studentData._id}`);
                setAttendance(response.data);
            } catch (err) {
                setError('Failed to fetch attendance records.');
            }
        };

        fetchAttendance();
    }, [studentData, navigate]);

    return (
        <div className="student-attendance-container">
            <div className="student-attendance-header">
                <h1><FontAwesomeIcon icon={faCalendarCheck} /> My Attendance</h1>
                <Link to="/student" className="back-link">
                    <FontAwesomeIcon icon={faArrowLeft} /> Back to Dashboard
                </Link>
            </div>
            {error && <p className="error-message">{error}</p>}
            <div className="attendance-list">
                {attendance.length > 0 ? (
                    attendance.map((record, index) => (
                        <div key={index} className={`attendance-card ${record.status.toLowerCase()}`}>
                            <div className="card-subject">{record.subject.subjectname}</div>
                            <div className="card-date">{new Date(record.date).toLocaleDateString()}</div>
                            <div className="card-status">{record.status}</div>
                        </div>
                    ))
                ) : (
                    <p>No attendance records found.</p>
                )}
            </div>
        </div>
    );
};

export default StudentAttendance;
