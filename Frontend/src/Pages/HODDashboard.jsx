import React from 'react';
import './Dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faUserGraduate,
  faChalkboardTeacher,
  faSchool,
  faBook,
  faBullhorn,
  faSignOutAlt,
  faExclamationCircle,
  faUserPlus,
  faPlus,
  faBookMedical,
  faUserTie
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const HodDashboard = () => {
    const navItems = [
        { icon: <FontAwesomeIcon icon={faHome} />, name: 'Dashboard', path: '/hod' },
        { icon: <FontAwesomeIcon icon={faPlus} />, name: 'Add Class', path: '/admin/add-class' },
        { icon: <FontAwesomeIcon icon={faBookMedical} />, name: 'Add Subject', path: '/admin/add-subject'},
        { icon: <FontAwesomeIcon icon={faUserTie} />, name: 'Add Teacher', path: '/admin/add-teacher' },
        { icon: <FontAwesomeIcon icon={faUserPlus} />, name: 'Add Student', path: '/admin/add-student' },
        { icon: <FontAwesomeIcon icon={faBullhorn} />, name: 'Add Notice', path: '/admin/add-notice' }, // <-- New Nav Item
        { icon: <FontAwesomeIcon icon={faUserGraduate} />, name: 'Students', path: '/admin/students' },
        { icon: <FontAwesomeIcon icon={faChalkboardTeacher} />, name: 'Teachers', path: '/admin/teachers' },
        { icon: <FontAwesomeIcon icon={faSchool} />, name: 'Classes', path: '/admin/classes' },
        { icon: <FontAwesomeIcon icon={faBook} />, name: 'Subjects', path: '/admin/subjects' },
        { icon: <FontAwesomeIcon icon={faExclamationCircle} />, name: 'Complaints', path: '/admin/complaints' },
        { icon: <FontAwesomeIcon icon={faSignOutAlt} />, name: 'Logout', path: '/logout' },
    ];

    // ... The rest of the component remains unchanged
    return (
        <div className="dashboard-container">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h1 className="logo">Admin Panel</h1>
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
                    </ul>
                </nav>
            </aside>
            <main className="main-content">
                <header className="header">
                    <h2 className="header-title">Dashboard Overview</h2>
                    <div className="header-actions">
                        <span>Welcome, Admin!</span>
                    </div>
                </header>
                <div className="content-area">
                    <section className="hero-section">
                        <h1>Welcome to the Admin Dashboard</h1>
                        <p>Manage your institution efficiently and effectively.</p>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default HodDashboard;