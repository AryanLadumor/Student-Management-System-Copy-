import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faUsers } from '@fortawesome/free-solid-svg-icons';
import './MyClasses.css';

const MyClasses = () => {
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
        <div className="my-classes-container">
            <h1 className="my-classes-title">My Classes</h1>
            <div className="my-classes-grid">
                {teacher.teaches && teacher.teaches.length > 0 ? (
                    teacher.teaches.map(item => (
                        <div key={item._id} className="class-card">
                            <div className="class-card-header">
                                <FontAwesomeIcon icon={faBook} className="class-card-icon" />
                                <h2 className="class-card-title">{item.class.classname}</h2>
                            </div>
                            <div className="class-card-body">
                                <p className="class-card-subject">{item.subject.subjectname}</p>
                                <Link
                                    to={`/teacher/class/${item.class._id}/subject/${item.subject._id}`}
                                    className="manage-students-link"
                                >
                                    <FontAwesomeIcon icon={faUsers} />
                                    <span>Manage Students</span>
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No classes have been assigned to you.</p>
                )}
            </div>
        </div>
    );
};

export default MyClasses;