import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faIdCard, faSchool, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
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
        return <div>Loading...</div>;
    }

    return (
        <div className="student-profile-container">
            <div className="student-profile-card">
                <Link to="/student" className="back-link">
                    <FontAwesomeIcon icon={faArrowLeft} /> Back to Dashboard
                </Link>
                <div className="student-profile-header">
                    <FontAwesomeIcon icon={faUser} size="4x" />
                    <h2>{student.name}</h2>
                </div>
                <div className="student-profile-body">
                    <div className="info-row">
                        <FontAwesomeIcon icon={faIdCard} className="info-icon" />
                        <div>
                            <strong>Roll Number:</strong>
                            <p>{student.rollnumber}</p>
                        </div>
                    </div>
                    <div className="info-row">
                        <FontAwesomeIcon icon={faSchool} className="info-icon" />
                        <div>
                            <strong>Class:</strong>
                            <p>{student.classname ? student.classname.classname : 'N/A'}</p>
                        </div>
                    </div>
                    <div className="info-row">
                        <FontAwesomeIcon icon={faSchool} className="info-icon" />
                        <div>
                            <strong>Institute:</strong>
                            <p>{student.admin ? student.admin.institutename : 'N/A'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;