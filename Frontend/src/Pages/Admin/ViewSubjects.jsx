import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/api';
import './View.css';
import './Modal.css';

const ViewSubjects = () => {
    const [subjects, setSubjects] = useState([]);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSubject, setCurrentSubject] = useState(null);
    // --- UPDATE STARTS HERE ---
    // Removed 'classname' from the state
    const [updatedData, setUpdatedData] = useState({ subjectname: '', subjectcode: '', sessions: '' });
    // --- UPDATE ENDS HERE ---

    const adminData = JSON.parse(localStorage.getItem('admin'));
    const adminId = adminData ? adminData.id : null;

    useEffect(() => {
        if (!adminId) {
            setError("Admin not found, please log in again.");
            return;
        }

        const fetchSubjects = async () => {
            try {
                const subjectsRes = await api.get(`/subjects/admin/${adminId}`);
                setSubjects(subjectsRes.data);
            } catch (err) {
                setError('Failed to fetch data.');
                console.error("Error fetching data:", err);
            }
        };

        fetchSubjects();
    }, [adminId]);

    const handleDelete = async (subjectId) => {
        if (window.confirm('Are you sure you want to delete this subject?')) {
            try {
                await api.delete(`/subjects/${subjectId}`);
                setSubjects(subjects.filter(s => s._id !== subjectId));
            } catch (err) {
                setError('Failed to delete subject.');
            }
        }
    };

    const handleEditClick = (subject) => {
        setCurrentSubject(subject);
        // --- UPDATE STARTS HERE ---
        // Removed 'classname' from the data being set
        setUpdatedData({
            subjectname: subject.subjectname,
            subjectcode: subject.subjectcode,
            sessions: subject.sessions,
        });
        // --- UPDATE ENDS HERE ---
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setCurrentSubject(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put(`/subjects/${currentSubject._id}`, updatedData);
            setSubjects(subjects.map(s =>
                s._id === currentSubject._id ? response.data.subject : s
            ));
            handleModalClose();
        } catch (err) {
            setError('Failed to update subject.');
            console.error("Error updating subject:", err);
        }
    };

    const filteredSubjects = subjects.filter(subject =>
        subject.subjectname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.subjectcode.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="view-container">
            <div className="view-header">
                <h1>Manage Subjects</h1>
                <Link to="/admin/add-subject" className="add-button">Add New Subject</Link>
                <Link to="/hod" className="add-button" style={{marginLeft: '10px', backgroundColor: '#6c757d'}}>Dashboard</Link>
            </div>
            <input
                type="text"
                placeholder="Search by name or code..."
                className="search-bar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {error && <p className="error-message">{error}</p>}

            <div className="view-table-container">
                <table className="view-table">
                    <thead>
                        <tr>
                            <th>Subject Name</th>
                            <th>Subject Code</th>
                            {/* --- UPDATE STARTS HERE --- */}
                            {/* The "Class" column has been removed */}
                            {/* --- UPDATE ENDS HERE --- */}
                            <th>Total Sessions</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSubjects.length > 0 ? (
                            filteredSubjects.map((subject) => (
                                <tr key={subject._id}>
                                    <td>{subject.subjectname}</td>
                                    <td>{subject.subjectcode}</td>
                                    {/* --- UPDATE STARTS HERE --- */}
                                    {/* The "Class" data cell has been removed */}
                                    {/* --- UPDATE ENDS HERE --- */}
                                    <td>{subject.sessions}</td>
                                    <td>
                                        <button className="edit-button" onClick={() => handleEditClick(subject)}>Edit</button>
                                        <button className="delete-button" onClick={() => handleDelete(subject._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">No subjects found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Edit Subject</h2>
                            <button onClick={handleModalClose} className="modal-close-button">&times;</button>
                        </div>
                        <form onSubmit={handleUpdateSubmit}>
                            <div className="modal-body">
                                <label>Subject Name</label>
                                <input type="text" name="subjectname" value={updatedData.subjectname} onChange={handleInputChange} required />
                                <label>Subject Code</label>
                                <input type="text" name="subjectcode" value={updatedData.subjectcode} onChange={handleInputChange} required />
                                <label>Total Sessions</label>
                                <input type="number" name="sessions" value={updatedData.sessions} onChange={handleInputChange} required />
                                {/* --- UPDATE STARTS HERE --- */}
                                {/* The "Class" select dropdown has been removed from the modal */}
                                {/* --- UPDATE ENDS HERE --- */}
                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={handleModalClose} className="modal-cancel-button">Cancel</button>
                                <button type="submit" className="modal-save-button">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewSubjects;