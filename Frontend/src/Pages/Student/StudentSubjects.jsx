import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faArrowLeft } from '@fortawesome/free-solid-svg-icons'; // <-- Import faArrowLeft
import './StudentSubjects.css';

const StudentSubjects = () => {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // This effect hook logic is good, no changes needed here.
        // I've just added the loading state management.
        const studentData = JSON.parse(localStorage.getItem('student'));
        if (!studentData || !studentData.classname) {
            navigate('/student/login');
            return;
        }

        const fetchSubjects = async () => {
            try {
                const response = await api.get(`/subjects/class/${studentData.classname._id}`);
                setSubjects(response.data);
            } catch (err) {
                if (err.response && err.response.status === 404) {
                    setSubjects([]);
                } else {
                    setError('Failed to fetch subjects.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchSubjects();
    }, [navigate]);

    return (
        <div className="subjects-page-container">
            {/* Create a dedicated header for the title and back button */}
            <header className="subjects-header">
                <h1><FontAwesomeIcon icon={faBook} /> My Subjects</h1>
                <Link to="/student" className="back-button">
                    <FontAwesomeIcon icon={faArrowLeft} />
                    <span>Back to Dashboard</span>
                </Link>
            </header>

            {error && <p className="error-message">{error}</p>}
            
            {loading ? (
                <div className="loading-message">Loading subjects...</div>
            ) : (
                <div className="subjects-grid">
                    {subjects.length > 0 ? (
                        subjects.map(subject => (
                            <div key={subject._id} className="subject-card">
                                <div className="subject-icon-wrapper">
                                    <FontAwesomeIcon icon={faBook} className="subject-icon" />
                                </div>
                                <h3 className="subject-name">{subject.subjectname}</h3>
                                <p className="subject-code">{subject.subjectcode}</p>
                            </div>
                        ))
                    ) : (
                        <div className="empty-state">
                            <p>No subjects found for your class.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default StudentSubjects;