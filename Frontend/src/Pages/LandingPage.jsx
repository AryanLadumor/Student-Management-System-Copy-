import React from 'react';
import { useNavigate } from 'react-router-dom'; // We'll use this for navigation
import './LandingPage.css'; // We'll create this CSS file next

const LandingPage = () => {
    const navigate = useNavigate(); // Hook to programmatically navigate

    const handleGetStartedClick = () => {
        navigate('/select-role'); // Navigate to the role selection page
    };

    return (
        <div className="landing-page-container">
            <div className="landing-page-content">
                <h1>Welcome to Your Student Management System</h1>
                <p>Manage attendance, grades, assignments, and more – all in one centralized and easy-to-use platform.</p>
                <button className="get-started-button" onClick={handleGetStartedClick}>
                    Get Started
                </button>
            </div>
        </div>
    );
};

export default LandingPage;     