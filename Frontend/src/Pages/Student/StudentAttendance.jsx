import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/api';
import './StudentAttendance.css'; // We will replace the content of this file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowLeft,
    faCalendarCheck,
    faCheckCircle,
    faTimesCircle,
    faPercentage,
    faUserCheck,
    faUserTimes
} from '@fortawesome/free-solid-svg-icons';

const StudentAttendance = () => {
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const studentDataString = localStorage.getItem('student');
        if (!studentDataString) {
            navigate('/student/login');
            return;
        }
        const studentData = JSON.parse(studentDataString);

        const fetchAttendance = async () => {
            try {
                const response = await api.get(`/attendance/${studentData._id}`);
                setAttendance(response.data);
            } catch (err) {
                setError('Failed to fetch attendance records.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAttendance();
    }, [navigate]);

    // Calculate summary statistics using useMemo for efficiency
    const attendanceSummary = useMemo(() => {
        if (attendance.length === 0) {
            return { totalPresent: 0, totalAbsent: 0, overallPercentage: 0 };
        }
        const totalPresent = attendance.filter(record => record.status === 'Present').length;
        const totalAbsent = attendance.length - totalPresent;
        const overallPercentage = Math.round((totalPresent / attendance.length) * 100);
        return { totalPresent, totalAbsent, overallPercentage };
    }, [attendance]);

    if (loading) {
        return <div className="loading-container">Loading attendance...</div>;
    }

    return (
        <div className="attendance-page-container">
            <header className="attendance-header">
                <h1><FontAwesomeIcon icon={faCalendarCheck} /> My Attendance</h1>
                <Link to="/student" className="back-button">
                    <FontAwesomeIcon icon={faArrowLeft} /> Back to Dashboard
                </Link>
            </header>

            {error && <p className="error-message">{error}</p>}

            {/* --- Summary Section --- */}
            <section className="summary-section">
                <div className="summary-card percentage">
                    <FontAwesomeIcon icon={faPercentage} className="summary-icon" />
                    <div className="summary-details">
                        <span className="summary-value">{attendanceSummary.overallPercentage}%</span>
                        <span className="summary-title">Overall</span>
                    </div>
                </div>
                <div className="summary-card present">
                    <FontAwesomeIcon icon={faUserCheck} className="summary-icon" />
                    <div className="summary-details">
                        <span className="summary-value">{attendanceSummary.totalPresent}</span>
                        <span className="summary-title">Present Days</span>
                    </div>
                </div>
                <div className="summary-card absent">
                    <FontAwesomeIcon icon={faUserTimes} className="summary-icon" />
                    <div className="summary-details">
                        <span className="summary-value">{attendanceSummary.totalAbsent}</span>
                        <span className="summary-title">Absent Days</span>
                    </div>
                </div>
            </section>

            {/* --- Attendance List --- */}
            <div className="attendance-list-container">
                <h2>Detailed Records</h2>
                <div className="attendance-list">
                    {attendance.length > 0 ? (
                        attendance
                            .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by most recent date
                            .map((record) => (
                                <div key={record._id} className={`attendance-card ${record.status.toLowerCase()}`}>
                                    <div className="card-details">
                                        <p className="card-subject">{record.subject.subjectname}</p>
                                        <p className="card-date">{new Date(record.date).toLocaleDateString('en-GB', {
                                            day: 'numeric', month: 'long', year: 'numeric'
                                        })}</p>
                                    </div>
                                    <div className={`card-status ${record.status.toLowerCase()}`}>
                                        <FontAwesomeIcon icon={record.status === 'Present' ? faCheckCircle : faTimesCircle} />
                                        <span>{record.status}</span>
                                    </div>
                                </div>
                            ))
                    ) : (
                        <div className="empty-state">
                            <p>No attendance records found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentAttendance;