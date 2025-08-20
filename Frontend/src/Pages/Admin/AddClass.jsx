import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/api'; // <-- Import the new api instance
import './Admin.css';

const AddClass = () => {
  const [classname, setClassname] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const adminData = JSON.parse(localStorage.getItem('admin'));
  const adminId = adminData ? adminData.id : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!adminId) {
      setError("You must be logged in to create a class.");
      return;
    }

    if (!classname.trim()) {
      setError('Class name cannot be empty.');
      return;
    }

    try {
      await api.post('/class', {
        classname,
        admin: adminId,
      });

      setSuccess(`Class "${classname}" created successfully!`);
      setClassname('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create class.';
      setError(message);
      console.error('Error creating class:', err.response || err);
    }
  };

  return (
    <div className="admin-page-container">
      <div className="admin-form-container">
        <h1>Create a New Class</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter Class Name (e.g., Grade 10A)"
            value={classname}
            onChange={(e) => setClassname(e.target.value)}
            required
          />
          <button type="submit">Create Class</button>
        </form>
        {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
        {success && <p style={{ color: 'green', marginTop: '1rem' }}>{success}</p>}
        <p style={{ marginTop: '1.5rem' }}>
          <Link to="/hod">Back to Dashboard</Link>
        </p>
      </div>
    </div>
  );
};

export default AddClass;