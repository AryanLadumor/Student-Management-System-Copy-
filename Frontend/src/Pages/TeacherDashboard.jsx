import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css'; // Your CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faSignOutAlt, faChalkboardUser, faBullhorn,faClipboardList} from '@fortawesome/free-solid-svg-icons';

const TeacherDashboard = () => {
    const [teacher, setTeacher] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedTeacher = localStorage.getItem('teacher');
        if (storedTeacher) {
            setTeacher(JSON.parse(storedTeacher));
        } else {
            // If no teacher data, redirect to login
            navigate('/teacher/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('teacher');
        navigate('/teacher/login');
    };

    const navItems = [
        { icon: <FontAwesomeIcon icon={faHome} />, name: 'Dashboard', path: '/teacher/dashboard' },
        { icon: <FontAwesomeIcon icon={faChalkboardUser} />, name: 'My Classes', path: '/teacher/classes' },
        { icon: <FontAwesomeIcon icon={faBullhorn} />, name: 'Notice Board', path: '/teacher/notices' },
        { icon: <FontAwesomeIcon icon={faUser} />, name: 'Profile', path: '/teacher/profile' },
        { icon: <FontAwesomeIcon icon={faClipboardList} />, name: 'View Marks', path: '/teacher/students/marks' },
    ];
    
    if (!teacher) {
        return <div>Loading...</div>; // Or a proper loader component
    }

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h1 className="logo">Teacher Panel</h1>
                </div>
                <nav className="sidebar-nav">
                    <ul>
                        {navItems.map((item, index) => (
                            <li key={index}>
                                <Link to={item.path} className="nav-link">
                                    {item.icon}
                                    <span className="nav-text">{item.name}</span>
                                </Link>
                            </li>
                        ))}
                         <li>
                            <a href="#" onClick={handleLogout} className="nav-link">
                                <FontAwesomeIcon icon={faSignOutAlt} />
                                <span className="nav-text">Logout</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <header className="header">
                    <h2 className="header-title">Dashboard</h2>
                    <div className="header-actions">
                        <strong style={{marginRight:"1rem"}}>Welcome, {teacher.name}!</strong>
                    </div>
                </header>

                <div className="content-area">
                    <section className="hero-section">
                        <h1>Your Assigned Classes & Subjects</h1>
                        <p>Select a class to manage attendance and marks.</p>
                    </section>
                    
                    <div className="bottom-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                        {teacher.teaches && teacher.teaches.length > 0 ? (
                            teacher.teaches.map(item => (
                                <div key={item._id} className="info-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <div>
                                        <h3>{item.class.classname}</h3>
                                        <p><strong>Subject:</strong> {item.subject.subjectname}</p>
                                    </div>
                                    <Link 
                                        to={`/teacher/class/${item.class._id}/subject/${item.subject._id}`}
                                        className="add-button" 
                                        style={{marginTop: '1rem', textDecoration: 'none', textAlign: 'center'}}
                                    >
                                        Manage Students
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <div className="info-card">
                                <h3>No Classes Assigned</h3>
                                <p>Please contact your administrator to be assigned to a class and subject.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TeacherDashboard;