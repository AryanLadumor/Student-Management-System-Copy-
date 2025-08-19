import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Admin.css';

const AdminRegister = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [institutename, setInstitutename] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/admin/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, institutename }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Registration successful:', data);
        navigate('/admin/login'); // Redirect to login page
      } else {
        console.error('Registration failed:', data.msg);
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  return (
    <div className="admin-page-container">
      <div className="admin-form-container">
        <h1>Admin Registration</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
          <input
            type="text"
            placeholder="Institute Name"
            value={institutename}
            onChange={(e) => setInstitutename(e.target.value)}
            required
          />
          <button type="submit">Register</button>
        </form>
        <p>
          Already have an account? <Link to="/admin/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default AdminRegister;