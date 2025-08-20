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
    const [updatedData, setUpdatedData] = useState({ name: '', email: '', teaches: [] });
    const [allClasses, setAllClasses] = useState([]);
    const [allSubjects, setAllSubjects] = useState([]);

    const adminData = JSON.parse(localStorage.getItem('admin'));
    const adminId = adminData ? adminData.id : null;

    useEffect(() => {
        if (!adminId) {
            setError("Admin details not found. Please log in again.");
            return;
        }

        const fetchData = async () => {
            try {
                const [teachersRes, classesRes, subjectsRes] = await Promise.all([
                    api.get(`/teachers/admin/${adminId}`),
                    api.get(`/class/${adminId}`),
                    api.get(`/subjects/admin/${adminId}`)
                ]);
                setTeachers(teachersRes.data);
                setAllClasses(classesRes.data);
                setAllSubjects(subjectsRes.data);
            } catch (err) {
                setError('Failed to fetch data.');
                console.error("Error fetching data:", err);
            }
        };

        fetchData();
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
    
    const handleEditClick = (teacher) => {
        setCurrentTeacher(teacher);
        setUpdatedData({
            name: teacher.name,
            email: teacher.email,
            teaches: teacher.teaches.map(t => ({ class: t.class._id, subject: t.subject._id }))
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
    
    const handleAssignmentChange = (index, field, value) => {
        const updatedTeaches = [...updatedData.teaches];
        updatedTeaches[index][field] = value;
        setUpdatedData(prev => ({...prev, teaches: updatedTeaches}));
    };

    const handleAddAssignment = () => {
        setUpdatedData(prev => ({...prev, teaches: [...prev.teaches, { class: '', subject: '' }]}));
    };

    const handleRemoveAssignment = (index) => {
        const updatedTeaches = updatedData.teaches.filter((_, i) => i !== index);
        setUpdatedData(prev => ({...prev, teaches: updatedTeaches}));
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put(`/teachers/${currentTeacher._id}`, updatedData);
            const updatedTeacher = response.data.teacher;
            
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
                <Link to="/hod" className="add-button" style={{marginLeft: '10px', backgroundColor: '#6c757d'}}>Dashboard</Link>
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
                                <h3 style={{ textAlign: 'left', marginTop: '1.5rem', marginBottom: '1rem' }}>Assign Classes & Subjects</h3>
                                {updatedData.teaches.map((assignment, index) => (
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
                                        {updatedData.teaches.length > 1 && (
                                            <button type="button" onClick={() => handleRemoveAssignment(index)} style={{ padding: '8px 12px', background: '#dc3545' }}>X</button>
                                        )}
                                    </div>
                                ))}
                                <button type="button" onClick={handleAddAssignment} style={{ width: 'auto', background: '#28a745', marginBottom: '1rem' }}>Add Another Assignment</button>
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