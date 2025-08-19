import React from 'react';
import { Link } from 'react-router-dom';
import './SelectRolePage.css';

export default function SelectRolePage() {
  return (
    <div className="role-selection-container">
        <h1>Select Your Role</h1>
        <div className="roles-wrapper">
            <Link to='/student'>
                <div className="role-card">
                    <p>Student</p>
                </div>
            </Link>
            <Link to='/teacher'>
                <div className="role-card">
                    <p>Teacher</p>
                </div>
            </Link>
            <Link to='/HOD'>
                <div className="role-card">
                    <p>HOD</p>
                </div>
            </Link>
        </div>
    </div>
  );
}