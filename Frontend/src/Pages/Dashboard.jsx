import React from 'react';
import './Dashboard.css'; // Your CSS file remains the same

// --- Font Awesome Imports ---
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faChartLine, faUser, faClipboard, faCog, faSearch } from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
    // --- Updated navItems with Font Awesome icons ---
    const navItems = [
        { icon: <FontAwesomeIcon icon={faHome} />, name: 'Dashboard' },
        { icon: <FontAwesomeIcon icon={faChartLine} />, name: 'Analytics', count: 3 },
        { icon: <FontAwesomeIcon icon={faUser} />, name: 'Student', count: 9 },
        { icon: <FontAwesomeIcon icon={faUser} />, name: 'Teachers', count: 9 },
        { icon: <FontAwesomeIcon icon={faUser} />, name: 'HOD', count: 9 },
        { icon: <FontAwesomeIcon icon={faClipboard} />, name: 'Reports' },
        { icon: <FontAwesomeIcon icon={faCog} />, name: 'Settings' },
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
                <div className="sidebar-header">
                    <h1 className="logo">Analytics</h1>
                </div>
                <div className="search-container">
                    {/* --- Updated search icon --- */}
                    <FontAwesomeIcon icon={faSearch} className="search-icon" />
                    <input type="text" placeholder="Search..." className="search-input" />
                </div>
                <nav className="sidebar-nav">
                    <ul>
                        {navItems.map((item, index) => (
                            <li key={index}>
                                <a href="#" className="nav-link">
                                    {item.icon}
                                    <span className="nav-text">{item.name}</span>
                                    {item.count && <span className="nav-count">{item.count}</span>}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                {/* Header */}
                <header className="header">
                    <h2 className="header-title">Dashboard Overview</h2>
                    <div className="header-actions">
                        <a href="#">Features</a>
                        <a href="#">Services</a>
                        <button>Sign Up</button>
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

export default Dashboard;