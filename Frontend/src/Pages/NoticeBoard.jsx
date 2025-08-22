import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import './NoticeBoard.css';
import './Admin/Modal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullhorn, faPlus, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const NoticeBoard = () => {
    const [notices, setNotices] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [isAdmin, setIsAdmin] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentNotice, setCurrentNotice] = useState(null);
    const [updatedData, setUpdatedData] = useState({ title: '', details: '', date: '' });

    const adminData = JSON.parse(localStorage.getItem('admin'));
    const studentData = JSON.parse(localStorage.getItem('student'));
    const teacherData = JSON.parse(localStorage.getItem('teacher'));

    useEffect(() => {
        const userData = studentData || teacherData || adminData;

        if (adminData) {
            setIsAdmin(true);
        }

        if (!userData) {
            navigate('/select-role');
            return;
        }

        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        try {
            const adminId = adminData
                ? adminData.id
                : studentData?.admin?._id || teacherData?.admin?._id;

            if (!adminId) {
                setError("Could not determine the institution to fetch notices for.");
                return;
            }

            const response = await api.get(`/notices/admin/${adminId}`);
            setNotices(response.data);
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setNotices([]);
            } else {
                setError('Failed to fetch notices.');
            }
        }
    };

    const handleDelete = async (noticeId) => {
        if (window.confirm('Are you sure you want to delete this notice?')) {
            try {
                await api.delete(`/notices/${noticeId}`);
                fetchNotices();
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
            date: new Date(notice.date).toISOString().split('T')[0],
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
        setUpdatedData((prev) => ({ ...prev, [name]: value }));
    };

    // ✅ Back Button Role-based Navigation
    const handleBack = () => {
        if (studentData) {
            navigate('/student');
        } else if (teacherData) {
            navigate('/teacher');
        } else if (adminData) {
            navigate('/admin');
        } else {
            navigate('/select-role');
        }
    };

    return (
        <div className="notice-board-container">
            {/* Back Button */}
            <button className="back-button" onClick={handleBack}>
                <FontAwesomeIcon icon={faArrowLeft} /> Back
            </button>

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
                    notices.map((notice) => (
                        <div key={notice._id} className="notice-card">
                            <h2 className="notice-title">{notice.title}</h2>
                            <p className="notice-details">{notice.details}</p>
                            <div className="notice-footer">
                                <p className="notice-date">
                                    Posted on: {new Date(notice.date).toLocaleDateString()}
                                </p>
                                {isAdmin && (
                                    <div className="notice-actions">
                                        <button
                                            className="edit-button"
                                            onClick={() => handleEditClick(notice)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="delete-button"
                                            onClick={() => handleDelete(notice._id)}
                                        >
                                            Delete
                                        </button>
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
                            <button onClick={handleModalClose} className="modal-close-button">
                                &times;
                            </button>
                        </div>
                        <form onSubmit={handleUpdateSubmit}>
                            <div className="modal-body">
                                <label>Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={updatedData.title}
                                    onChange={handleInputChange}
                                    required
                                />
                                <label>Details</label>
                                <textarea
                                    name="details"
                                    value={updatedData.details}
                                    onChange={handleInputChange}
                                    required
                                    rows="6"
                                />
                                <label>Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={updatedData.date}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    onClick={handleModalClose}
                                    className="modal-cancel-button"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="modal-save-button">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NoticeBoard;
