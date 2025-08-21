import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import './NoticeBoard.css';
import './Admin/Modal.css'; // For the edit modal
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullhorn, faPlus } from '@fortawesome/free-solid-svg-icons';

const NoticeBoard = () => {
    const [notices, setNotices] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [isAdmin, setIsAdmin] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentNotice, setCurrentNotice] = useState(null);
    const [updatedData, setUpdatedData] = useState({ title: '', details: '', date: '' });
    
    const adminData = JSON.parse(localStorage.getItem('admin'));
    
    useEffect(() => {
        const studentData = JSON.parse(localStorage.getItem('student'));
        const teacherData = JSON.parse(localStorage.getItem('teacher'));
        const userData = studentData || teacherData || adminData;
        
        if (adminData) {
            setIsAdmin(true);
        }

        // --- FIX STARTS HERE ---
        // The previous check was incorrect for the admin user.
        // This new check ensures that there is some valid user data before proceeding.
        if (!userData) {
            navigate('/select-role');
            return;
        }
        // --- FIX ENDS HERE ---

        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        try {
            // --- FIX STARTS HERE ---
            // This logic now correctly gets the admin ID whether the user is a student, teacher, or the admin.
            const adminId = adminData ? adminData.id : (JSON.parse(localStorage.getItem('student'))?.admin?._id || JSON.parse(localStorage.getItem('teacher'))?.admin?._id);
            
            if (!adminId) {
                setError("Could not determine the institution to fetch notices for.");
                return;
            }
            // --- FIX ENDS HERE ---

            const response = await api.get(`/notices/admin/${adminId}`);
            setNotices(response.data);
        } catch (err) {
            // --- FIX STARTS HERE ---
            // This now handles the 404 error gracefully when no notices are found.
            if (err.response && err.response.status === 404) {
                setNotices([]);
            } else {
                setError('Failed to fetch notices.');
            }
            // --- FIX ENDS HERE ---
        }
    };
    
    const handleDelete = async (noticeId) => {
        if (window.confirm('Are you sure you want to delete this notice?')) {
            try {
                await api.delete(`/notices/${noticeId}`);
                fetchNotices(); // Refresh the list after deleting
            } catch (err) {
                setError('Failed to delete notice.');
            }
        }
    };

    const handleEditClick = (notice) => {
        setCurrentNotice(notice);
        setUpdatedData({
            title: notice.title,
            details: notice.details,
            date: new Date(notice.date).toISOString().split('T')[0]
        });
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setCurrentNotice(null);
    };
    
    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/notices/${currentNotice._id}`, updatedData);
            fetchNotices();
            handleModalClose();
        } catch (err) {
            setError('Failed to update notice.');
        }
    };
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="notice-board-container">
            <div className="notice-board-header">
                <h1><FontAwesomeIcon icon={faBullhorn} /> Notice Board</h1>
                {isAdmin && (
                    <Link to="/admin/add-notice" className="add-button">
                        <FontAwesomeIcon icon={faPlus} /> Add New Notice
                    </Link>
                )}
            </div>
            {error && <p className="error-message">{error}</p>}
            <div className="notice-list">
                {notices.length > 0 ? (
                    notices.map(notice => (
                        <div key={notice._id} className="notice-card">
                            <h2 className="notice-title">{notice.title}</h2>
                            <p className="notice-details">{notice.details}</p>
                            <div className="notice-footer">
                                <p className="notice-date">Posted on: {new Date(notice.date).toLocaleDateString()}</p>
                                {isAdmin && (
                                    <div className="notice-actions">
                                        <button className="edit-button" onClick={() => handleEditClick(notice)}>Edit</button>
                                        <button className="delete-button" onClick={() => handleDelete(notice._id)}>Delete</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-notices-card">
                        <p>No notices have been posted yet.</p>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Edit Notice</h2>
                            <button onClick={handleModalClose} className="modal-close-button">&times;</button>
                        </div>
                        <form onSubmit={handleUpdateSubmit}>
                            <div className="modal-body">
                                <label>Title</label>
                                <input type="text" name="title" value={updatedData.title} onChange={handleInputChange} required />
                                <label>Details</label>
                                <textarea name="details" value={updatedData.details} onChange={handleInputChange} required rows="6" />
                                <label>Date</label>
                                <input type="date" name="date" value={updatedData.date} onChange={handleInputChange} required />
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

export default NoticeBoard;