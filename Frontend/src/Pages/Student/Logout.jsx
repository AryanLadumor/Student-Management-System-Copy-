import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('student');
        navigate('/student/login');
    }, [navigate]);

    return (
        <div>
            <p>Logging out...</p>
        </div>
    );
};

export default Logout;