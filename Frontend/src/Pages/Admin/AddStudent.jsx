import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/api'; // <-- Import the new api instance
import './Admin.css';

const AddStudent = () => {
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [password, setPassword] = useState('');
  const [className, setClassName] = useState('');
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const adminData = JSON.parse(localStorage.getItem('admin'));
  const adminId = adminData ? adminData.id : null;

  useEffect(() => {
    if (!adminId) {
        setError("Admin not found, please log in again.");
        return;
    }
    const fetchClasses = async () => {
      try {
        // The token is automatically added by the interceptor in api.js
        const response = await api.get(`/class/${adminId}`);
        setClasses(response.data);
      } catch (err) {
        console.error('Error fetching classes:', err);
        setError('Could not load classes.');
      }
    };

    fetchClasses();
  }, [adminId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.post('/students/register', {
        name,
        rollnumber: rollNumber,
        password,
        classname: className,
        admin: adminId
      });

      setSuccess('Student registered successfully!');
      setTimeout(() => navigate('/hod'), 2000);
    } catch (err) {
      const message = err.response?.data?.msg || 'Registration failed.';
      setError(message);
      console.error('Error during student registration:', err.response || err);
    }
  };

  return (
    <div className="admin-page-container">
      <div className="admin-form-container">
        <h1>Register New Student</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Student Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Roll Number"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <select
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            required
            style={{ width: '100%', padding: '12px', marginBottom: '1rem', border: '1px solid #ced4da', borderRadius: '4px' }}
          >
            <option value="">Select a Class</option>
            {classes.length > 0 ? (
              classes.map((c) => (
              <option key={c._id} value={c._id}>
                {c.classname}
              </option>
            ))
            ) : (
                <option disabled>No classes found</option>
            )}
          </select>
          <button type="submit">Add Student</button>
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

export default AddStudent;