import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './StudentDashboard.css'; // The updated CSS is provided below

// --- Font Awesome Imports ---
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faHome, faUser, faBookOpen, faBullhorn, faCommentDots, 
    faRightFromBracket, faCalendarCheck, faChartBar 
} from '@fortawesome/free-solid-svg-icons';

const StudentDashboard = () => {
    const [student, setStudent] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const studentDataString = localStorage.getItem('student');
        if (studentDataString) {
            setStudent(JSON.parse(studentDataString));
        } else {
            navigate('/student/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('student');
        navigate('/student/login');
    };

    // --- Sidebar Navigation Items (Unchanged) ---
    const navItems = [
        { icon: <FontAwesomeIcon icon={faHome} />, name: 'Dashboard', path: '/student' },
        { icon: <FontAwesomeIcon icon={faBookOpen} />, name: 'Subjects', path: '/student/subjects' },
        { icon: <FontAwesomeIcon icon={faCalendarCheck} />, name: 'Attendance', path: '/student/attendance' },
        { icon: <FontAwesomeIcon icon={faChartBar} />, name: 'Exam Results', path: '/student/results' },
        { icon: <FontAwesomeIcon icon={faBullhorn} />, name: 'Notice Board', path: '/student/notices' },
        { icon: <FontAwesomeIcon icon={faCommentDots} />, name: 'My Complaints', path: '/student/my-complaints' },
        { icon: <FontAwesomeIcon icon={faUser} />, name: 'Profile', path: '/student/profile' },
        { icon: <FontAwesomeIcon icon={faRightFromBracket} />, name: 'Logout', action: handleLogout },
    ];

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <nav className="sidebar-nav">
                    <ul>
                        {navItems.map((item, index) => (
                            <li key={index}>
                                {item.action ? (
                                    <a href="#!" onClick={item.action} className="nav-link">
                                        {item.icon}
                                        <span className="nav-text">{item.name}</span>
                                    </a>
                                ) : (
                                    <Link to={item.path} className="nav-link">
                                        {item.icon}
                                        <span className="nav-text">{item.name}</span>
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <div className="content-area">
                    {/* New Welcome Hero Section */}
                    <section className="welcome-hero">
                        <div className="hero-text">
                            <h1>Welcome back, {student ? student.name : 'Student'}!</h1>
                            <p>This is your central hub for academic success. Use the menu on the left to navigate to your subjects, check your attendance, and view your exam results.</p>
                        </div>
                        <div className="hero-image">
                            {/* Illustration from unDraw - a great resource for free illustrations */}
                            <img src="https://illustrations.popsy.co/white/student-going-to-school.svg" alt="Student Illustration" />
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default StudentDashboard;