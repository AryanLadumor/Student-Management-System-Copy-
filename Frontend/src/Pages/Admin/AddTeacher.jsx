import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/api';
import './Admin.css';

const AddTeacher = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [teaches, setTeaches] = useState([{ class: '', subject: '' }]);
    
    // For populating dropdowns
    const [allClasses, setAllClasses] = useState([]);
    const [allSubjects, setAllSubjects] = useState([]);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const adminData = JSON.parse(localStorage.getItem('admin'));
    const adminId = adminData ? adminData.id : null;

    // Fetch classes and subjects on component mount
    useEffect(() => {
        if (!adminId) {
            setError("Admin not found, please log in again.");
            return;
        }

        const fetchData = async () => {
            try {
                const [classesRes, subjectsRes] = await Promise.all([
                    api.get(`/class/${adminId}`),
                    api.get(`/subjects/admin/${adminId}`)
                ]);
                setAllClasses(classesRes.data);
                setAllSubjects(subjectsRes.data);
            } catch (err) {
                setError('Failed to load classes or subjects.');
                console.error(err);
            }
        };

        fetchData();
    }, [adminId]);

    const handleAssignmentChange = (index, field, value) => {
        const updatedTeaches = [...teaches];
        updatedTeaches[index][field] = value;
        setTeaches(updatedTeaches);
    };

    const handleAddAssignment = () => {
        setTeaches([...teaches, { class: '', subject: '' }]);
    };

    const handleRemoveAssignment = (index) => {
        const updatedTeaches = teaches.filter((_, i) => i !== index);
        setTeaches(updatedTeaches);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Filter out incomplete assignments and validate
        const finalTeaches = teaches.filter(t => t.class && t.subject);
        if (finalTeaches.length === 0) {
            setError("Please assign at least one valid class and subject.");
            return;
        }

        try {
            await api.post('/teachers/register', {
                name,
                email,
                password,
                admin: adminId,
                teaches: finalTeaches,
            });

            setSuccess(`Teacher "${name}" registered successfully!`);
            // Reset form
            setName('');
            setEmail('');
            setPassword('');
            setTeaches([{ class: '', subject: '' }]);
            setTimeout(() => navigate('/hod'), 2000);

        } catch (err) {
            const message = err.response?.data?.message || 'Failed to register teacher.';
            setError(message);
            console.error(err);
        }
    };

    return (
        <div className="admin-page-container">
            <div className="admin-form-container" style={{ maxWidth: '600px' }}>
                <h1>Register New Teacher</h1>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Teacher Name" value={name} onChange={(e) => setName(e.target.value)} required />
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />

                    <h3 style={{ textAlign: 'left', marginTop: '1.5rem', marginBottom: '1rem' }}>Assign Classes & Subjects</h3>
                    {teaches.map((assignment, index) => (
                        <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '1rem', alignItems: 'center' }}>
                            <select
                                value={assignment.class}
                                onChange={(e) => handleAssignmentChange(index, 'class', e.target.value)}
                                style={{ flex: 1, padding: '12px', border: '1px solid #ced4da', borderRadius: '4px' }}
                            >
                                <option value="">Select Class</option>
                                {allClasses.map(c => <option key={c._id} value={c._id}>{c.classname}</option>)}
                            </select>
                            <select
                                value={assignment.subject}
                                onChange={(e) => handleAssignmentChange(index, 'subject', e.target.value)}
                                style={{ flex: 1, padding: '12px', border: '1px solid #ced4da', borderRadius: '4px' }}
                            >
                                <option value="">Select Subject</option>
                                {allSubjects.map(s => <option key={s._id} value={s._id}>{s.subjectname}</option>)}
                            </select>
                            {teaches.length > 1 && (
                                <button type="button" onClick={() => handleRemoveAssignment(index)} style={{ padding: '8px 12px', background: '#dc3545' }}>X</button>
                            )}
                        </div>
                    ))}
                    <button type="button" onClick={handleAddAssignment} style={{ width: 'auto', background: '#28a745', marginBottom: '1rem' }}>Add Another Assignment</button>

                    <button type="submit">Register Teacher</button>
                </form>
                {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
                {success && <p style={{ color: 'green', marginTop: '1rem' }}>{success}</p>}
                <p style={{ marginTop: '1.5rem' }}><Link to="/hod">Back to Dashboard</Link></p>
            </div>
        </div>
    );
};

export default AddTeacher;