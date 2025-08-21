import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/api';
import './View.css';
import './Modal.css';

const ViewClasses = () => {
    const [classes, setClasses] = useState([]);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentClass, setCurrentClass] = useState(null);
    const [updatedClassName, setUpdatedClassName] = useState('');

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
                setError('Failed to fetch classes.');
            }
        };
        fetchClasses();
    }, [adminId]);

    const handleDelete = async (classId) => {
        if (window.confirm('Are you sure you want to delete this class?')) {
            try {
                await api.delete(`/class/detail/${classId}`);
                setClasses(classes.filter(c => c._id !== classId));
            } catch (err) {
                setError('Failed to delete class.');
            }
        }
    };

    const handleEditClick = (classItem) => {
        setCurrentClass(classItem);
        setUpdatedClassName(classItem.classname);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setCurrentClass(null);
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        try {
            const response = await api.put(`/class/detail/${currentClass._id}`, {
                classname: updatedClassName
            });
            setClasses(classes.map(c => 
                c._id === currentClass._id ? response.data.class : c
            ));
            handleModalClose();
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to update class.';
            setError(message); // Set the new error from the backend
        }
    };

    const filteredClasses = classes.filter(c => 
        c.classname.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="view-container">
            <div className="view-header">
                <h1>Manage Classes</h1>
                <Link to="/admin/add-class" className="add-button">Add New Class</Link>
                <Link to="/hod" className="add-button" style={{marginLeft: '10px', backgroundColor: '#6c757d'}}>Dashboard</Link>
            </div>
            <input 
                type="text"
                placeholder="Search by class name..."
                className="search-bar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {error && !isModalOpen && <p className="error-message">{error}</p>}

            <div className="view-table-container">
                <table className="view-table">
                    <thead>
                        <tr>
                            <th>Class Name</th>
                            <th>Created On</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredClasses.length > 0 ? (
                            filteredClasses.map((c) => (
                                <tr key={c._id}>
                                    <td>{c.classname}</td>
                                    <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <button className="edit-button" onClick={() => handleEditClick(c)}>Edit</button>
                                        <button className="delete-button" onClick={() => handleDelete(c._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3">No classes found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Edit Class</h2>
                            <button onClick={handleModalClose} className="modal-close-button">&times;</button>
                        </div>
                        <form onSubmit={handleUpdateSubmit}>
                            <div className="modal-body">
                                <input 
                                    type="text"
                                    value={updatedClassName}
                                    onChange={(e) => setUpdatedClassName(e.target.value)}
                                    required
                                />
                                {error && isModalOpen && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
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

export default ViewClasses;
