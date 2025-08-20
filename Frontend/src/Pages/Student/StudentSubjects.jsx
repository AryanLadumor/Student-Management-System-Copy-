import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import './StudentSubjects.css';

const StudentSubjects = () => {
    const [subjects, setSubjects] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const studentData = JSON.parse(localStorage.getItem('student'));

    useEffect(() => {
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
            }
        };

        fetchSubjects();
    }, [studentData, navigate]);

    return (
        <div className="student-subjects-container">
            <h1>My Subjects</h1>
            {error && <p className="error-message">{error}</p>}
            <div className="subjects-grid">
                {subjects.length > 0 ? (
                    subjects.map(subject => (
                        <div key={subject._id} className="subject-card">
                            <FontAwesomeIcon icon={faBook} className="subject-icon" />
                            <h3 className="subject-name">{subject.subjectname}</h3>
                            <p className="subject-code">{subject.subjectcode}</p>
                        </div>
                    ))
                ) : (
                    <p>No subjects found for your class.</p>
                )}
            </div>
        </div>
    );
};

export default StudentSubjects;