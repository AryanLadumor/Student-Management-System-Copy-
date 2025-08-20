import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/api';
import './Admin.css';

const AddSubject = () => {
    const [subjectName, setSubjectName] = useState('');
    const [subjectCode, setSubjectCode] = useState('');
    const [sessions, setSessions] = useState('');
    const [className, setClassName] = useState('');
    const [classes, setClasses] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const adminData = JSON.parse(localStorage.getItem('admin'));
    const adminId = adminData ? adminData.id : null;

    useEffect(() => {
        if (!adminId) {
            setError("Admin not found, please log in again.");
            return;
        }
        const fetchClasses = async () => {
            try {
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

        if (!className) {
            setError('Please select a class.');
            return;
        }

        try {
            await api.post('/subjects/createsub', {
                subjectname: subjectName,
                subjectcode: subjectCode,
                sessions,
                classname: className,
                adminId: adminId
            });

            setSuccess(`Subject "${subjectName}" created successfully!`);
            // Clear form fields
            setSubjectName('');
            setSubjectCode('');
            setSessions('');
            setClassName('');
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to create subject.';
            setError(message);
            console.error('Error creating subject:', err.response || err);
        }
    };

    return (
        <div className="admin-page-container">
            <div className="admin-form-container">
                <h1>Create New Subject</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Subject Name (e.g., Mathematics)"
                        value={subjectName}
                        onChange={(e) => setSubjectName(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Subject Code (e.g., MATH101)"
                        value={subjectCode}
                        onChange={(e) => setSubjectCode(e.target.value)}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Total Sessions"
                        value={sessions}
                        onChange={(e) => setSessions(e.target.value)}
                        required
                    />
                    <select
                        value={className}
                        onChange={(e) => setClassName(e.target.value)}
                        required
                        style={{ width: '100%', padding: '12px', marginBottom: '1rem', border: '1px solid #ced4da', borderRadius: '4px' }}
                    >
                        <option value="">Assign to Class</option>
                        {classes.length > 0 ? (
                            classes.map((c) => (
                                <option key={c._id} value={c._id}>
                                    {c.classname}
                                </option>
                            ))
                        ) : (
                            <option disabled>No classes available</option>
                        )}
                    </select>
                    <button type="submit">Create Subject</button>
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

export default AddSubject;