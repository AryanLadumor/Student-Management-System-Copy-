import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faIdCard, faSchool, faUniversity, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './StudentProfile.css';

const StudentProfile = () => {
    const [student, setStudent] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedStudent = localStorage.getItem('student');
        if (storedStudent) {
            setStudent(JSON.parse(storedStudent));
        } else {
            navigate('/student/login');
        }
    }, [navigate]);

    if (!student) {
        return <div className="loading">Loading profile...</div>;
    }

    return (
        <div className="student-profile-container">
            {/* Back Button (outside card) */}
            <div className="back-button-wrapper">
                <Link to="/student" className="back-button">
                    <FontAwesomeIcon icon={faArrowLeft} /> Back to Dashboard
                </Link>
            </div>

            {/* Profile Card */}
            <div className="student-profile-card">
                <div className="student-profile-header">
                    <div className="profile-avatar">
                        <FontAwesomeIcon icon={faUser} size="4x" />
                    </div>
                    <h2>{student.name}</h2>
                    <p className="profile-subtext">Student Profile</p>
                </div>

                <div className="student-profile-body">
                    <div className="info-row">
                        <FontAwesomeIcon icon={faIdCard} className="info-icon" />
                        <div>
                            <span className="info-label">Roll Number</span>
                            <p className="info-value">{student.rollnumber}</p>
                        </div>
                    </div>
                    <div className="info-row">
                        <FontAwesomeIcon icon={faSchool} className="info-icon" />
                        <div>
                            <span className="info-label">Class</span>
                            <p className="info-value">{student.classname ? student.classname.classname : 'N/A'}</p>
                        </div>
                    </div>
                    <div className="info-row">
                        <FontAwesomeIcon icon={faUniversity} className="info-icon" />
                        <div>
                            <span className="info-label">Institute</span>
                            <p className="info-value">{student.admin ? student.admin.institutename : 'N/A'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;
