import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/api'; // <-- Import the new api instance
import './Admin.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/admin/login', {
        email,
        password,
      });

      // With axios, the response data is in the `data` property
      const { token, admin } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('admin', JSON.stringify(admin));
      
      navigate('/hod');
    } catch (err) {
      // Axios puts error responses in `err.response`
      const message = err.response?.data?.msg || 'Login failed. Please try again.';
      setError(message);
      console.error('Error during login:', err.response || err);
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
        {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
        <p>
          Don't have an account? <Link to="/admin/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;