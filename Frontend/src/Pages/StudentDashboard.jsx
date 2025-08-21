import React from 'react';
import './Dashboard.css'; // Your CSS file remains the same
import { Link } from 'react-router-dom';

// --- Font Awesome Imports ---
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faBookOpen, faBullhorn , faCommentDots,faRightFromBracket,faCalendarCheck,faChartBar } from '@fortawesome/free-solid-svg-icons';

const StudentDashboard = () => {
    // --- Updated navItems with Font Awesome icons ---
    const navItems = [
        { icon: <FontAwesomeIcon icon={faHome} />, name: 'Dashboard', path: '/student' },
        { icon: <FontAwesomeIcon icon={faBookOpen} />, name: 'Subjects', path: '/student/subjects' },
        { icon: <FontAwesomeIcon icon={faCalendarCheck} />, name: 'Attendance', path: '/student/attendance'},
        { icon: <FontAwesomeIcon icon={faCommentDots} />, name: 'My Complaints', path: '/student/my-complaints'},
        { icon: <FontAwesomeIcon icon={faUser} />, name: 'Profile', path: '/student/profile' },
        { icon: <FontAwesomeIcon icon={faChartBar} />, name: 'Exam Results', path: '/student/results' },
        { icon: <FontAwesomeIcon icon={faBullhorn} />, name: 'Notice Board', path: '/student/notices' },
        { icon: <FontAwesomeIcon icon={faRightFromBracket} />, name: 'Logout', path: '/student/logout' },
    ];

    const tableData = [
        { name: 'Weekly Signups', value: '472' },
        { name: 'New Leads', value: '1,204' },
        { name: 'Conversion Rate', value: '12%' },
        { name: 'Bounce Rate', value: '23%' },
    ];


    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className="sidebar">
                {/* <div className="sidebar-header">
                    <h1 className="logo">abcd</h1>
                </div> */}
                {/* <div className="search-container"> */}
                    {/* --- Updated search icon --- */}
                    {/* <FontAwesomeIcon icon={faSearch} className="search-icon" /> */}
                    {/* <input type="text" placeholder="Search..." className="search-input" /> */}
                {/* </div> */}
                <nav className="sidebar-nav">
                    <ul>
                        {navItems.map((item, index) => (
                            <li key={index}>
                                <Link to={item.path} className="nav-link">
                                    {item.icon}
                                    <span className="nav-text">{item.name}</span>
                                    {item.count && <span className="nav-count">{item.count}</span>}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                {/* Header */}
                <header className="header">
                    <h2 className="header-title">Student Dashboard</h2>
                    <div className="header-actions">
                        <a href="#">Features</a>
                        <a href="#">Services</a>
                        {/* <button>Sign Up</button> */}
                    </div>
                </header>

                {/* Content Area */}
                <div className="content-area">
                    {/* Hero Section */}
                    <section className="hero-section">
                        <h1>Drive More Customer Action</h1>
                        <p>Unlock the full potential of your business with our cutting-edge analytics platform.</p>
                        <button>Explore Our Solutions</button>
                    </section>

                    {/* Bottom Section */}
                    <section className="bottom-grid">
                        <div className="info-card">
                            <img src="https://cdn-icons-png.flaticon.com/512/3242/3242251.png" alt="Data Illustration" />
                            <div>
                                <h3>Powerful Integrations</h3>
                                <p>Connect all your data sources with ease to get a complete view of your customer journey.</p>
                            </div>
                        </div>
                        <div className="data-table-card">
                            <h3>Key Performance Indicators</h3>
                            <table>
                                <tbody>
                                    {tableData.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.name}</td>
                                            <td>{item.value}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default StudentDashboard;