import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Admin.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        // Handle successful login, e.g., store token, redirect
        console.log('Login successful:', data);
        navigate('/hod'); // Redirect to admin dashboard
      } else {
        // Handle login error
        console.error('Login failed:', data.msg);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div className="admin-page-container">
      <div className="admin-form-container">
        <h1>Admin Login</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        <p>
          Don't have an account? <Link to="/admin/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;