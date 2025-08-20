import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/api';
import './View.css';
import './Modal.css'; // Make sure modal styles are imported

const ViewTeachers = () => {
    const [teachers, setTeachers] = useState([]);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // State for modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTeacher, setCurrentTeacher] = useState(null);
    const [updatedData, setUpdatedData] = useState({ name: '', email: '' });

    const adminData = JSON.parse(localStorage.getItem('admin'));
    const adminId = adminData ? adminData.id : null;

    useEffect(() => {
        if (!adminId) {
            setError("Admin details not found. Please log in again.");
            return;
        }

        const fetchTeachers = async () => {
            try {
                const response = await api.get(`/teachers/admin/${adminId}`);
                setTeachers(response.data);
            } catch (err) {
                setError('Failed to fetch teachers.');
                console.error("Error fetching teachers:", err);
            }
        };

        fetchTeachers();
    }, [adminId]);

    const handleDelete = async (teacherId) => {
        if (window.confirm('Are you sure you want to delete this teacher?')) {
            try {
                await api.delete(`/teachers/${teacherId}`);
                setTeachers(teachers.filter(t => t._id !== teacherId));
            } catch (err) {
                setError('Failed to delete teacher.');
            }
        }
    };
    
    // --- NEW FUNCTIONS FOR MODAL ---
    const handleEditClick = (teacher) => {
        setCurrentTeacher(teacher);
        setUpdatedData({
            name: teacher.name,
            email: teacher.email
        });
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setCurrentTeacher(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put(`/teachers/${currentTeacher._id}`, updatedData);
            // The backend returns the full teacher object, let's merge it with existing data
            // to keep the populated 'teaches' array visible
            const updatedTeacher = { ...currentTeacher, ...response.data.teacher };
            
            setTeachers(teachers.map(t => 
                t._id === currentTeacher._id ? updatedTeacher : t
            ));
            handleModalClose();
        } catch (err) {
            setError('Failed to update teacher.');
            console.error("Error updating teacher:", err);
        }
    };
    
    const filteredTeachers = teachers.filter(teacher =>
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="view-container">
            {/* Header and search bar remain the same */}
            <div className="view-header">
                <h1>Manage Teachers</h1>
                <Link to="/admin/add-teacher" className="add-button">Add New Teacher</Link>
            </div>
            <input 
                type="text"
                placeholder="Search by name or email..."
                className="search-bar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {error && <p className="error-message">{error}</p>}
            
            <div className="view-table-container">
                <table className="view-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Teaches</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTeachers.length > 0 ? (
                            filteredTeachers.map((teacher) => (
                                <tr key={teacher._id}>
                                    <td>{teacher.name}</td>
                                    <td>{teacher.email}</td>
                                    <td>
                                        {teacher.teaches && teacher.teaches.map(t => (
                                            <span key={t._id || t.class._id} className="badge">
                                                {t.class.classname} - {t.subject.subjectname}
                                            </span>
                                        ))}
                                    </td>
                                    <td>
                                        <button className="edit-button" onClick={() => handleEditClick(teacher)}>Edit</button>
                                        <button className="delete-button" onClick={() => handleDelete(teacher._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">No teachers found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* --- NEW MODAL JSX --- */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Edit Teacher</h2>
                            <button onClick={handleModalClose} className="modal-close-button">&times;</button>
                        </div>
                        <form onSubmit={handleUpdateSubmit}>
                            <div className="modal-body">
                                <label>Name</label>
                                <input type="text" name="name" value={updatedData.name} onChange={handleInputChange} required />
                                <label>Email</label>
                                <input type="email" name="email" value={updatedData.email} onChange={handleInputChange} required />
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

export default ViewTeachers;