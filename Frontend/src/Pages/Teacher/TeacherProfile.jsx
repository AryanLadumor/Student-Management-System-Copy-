import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faChalkboard } from '@fortawesome/free-solid-svg-icons';
import './TeacherProfile.css';

const TeacherProfile = () => {
    const [teacher, setTeacher] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedTeacher = localStorage.getItem('teacher');
        if (storedTeacher) {
            setTeacher(JSON.parse(storedTeacher));
        } else {
            navigate('/teacher/login');
        }
    }, [navigate]);

    if (!teacher) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="profile-header">
                    <FontAwesomeIcon icon={faUser} size="3x" className="profile-icon" />
                    <h2>{teacher.name}</h2>
                    <p className="profile-role">Teacher</p>
                </div>
                <div className="profile-body">
                    <div className="profile-info-item">
                        <FontAwesomeIcon icon={faEnvelope} className="info-icon" />
                        <span>{teacher.email}</span>
                    </div>
                    <hr />
                    <div className="profile-info-item">
                        <FontAwesomeIcon icon={faChalkboard} className="info-icon" />
                        <h3>Assigned Classes & Subjects</h3>
                    </div>
                    <ul className="assignments-list">
                        {teacher.teaches && teacher.teaches.length > 0 ? (
                            teacher.teaches.map(item => (
                                <li key={item._id} className="assignment-item">
                                    <span className="class-name">{item.class.classname}</span>
                                    <span className="subject-name">{item.subject.subjectname}</span>
                                </li>
                            ))
                        ) : (
                            <p>No classes assigned.</p>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default TeacherProfile;