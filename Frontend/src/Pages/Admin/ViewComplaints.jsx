import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import './ViewComplaints.css';
import './Modal.css';

const ViewComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentComplain, setCurrentComplain] = useState(null);
    const [response, setResponse] = useState('');
    const [status, setStatus] = useState('');
    const navigate = useNavigate();

    // --- FIX STARTS HERE ---
    // The component was incorrectly trying to get the admin ID from student data.
    // This now correctly gets the admin data from local storage.
    const adminData = JSON.parse(localStorage.getItem('admin'));
    const adminId = adminData ? adminData.id : null;

    useEffect(() => {
        if (!adminId) {
            // If no admin is logged in, redirect to the login page.
            navigate('/admin/login');
            return;
        }
        fetchComplaints();
    }, [adminId, navigate]);
    // --- FIX ENDS HERE ---

    const fetchComplaints = async () => {
        try {
            const res = await api.get(`/complain/admin/${adminId}`);
            setComplaints(res.data);
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setComplaints([]); // Handle case where no complaints are found
            } else {
                setError('Failed to fetch complaints.');
            }
        }
    };

    const handleEditClick = (complain) => {
        setCurrentComplain(complain);
        setResponse(complain.response || '');
        setStatus(complain.status);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setCurrentComplain(null);
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.patch(`/complain/${currentComplain._id}/status`, {
                status,
                response,
            });
            fetchComplaints(); // Refetch to get the updated list
            handleModalClose();
        } catch (err) {
            setError('Failed to update complaint.');
        }
    };

    const getStatusClass = (status) => {
        if (status === 'Resolved') return 'status-resolved';
        if (status === 'Rejected') return 'status-rejected';
        return 'status-pending';
    };

    return (
        <div className="view-complaints-container">
            <h1>Manage Complaints</h1>
            {error && <p className="error-message">{error}</p>}
            <div className="complaints-list">
                {complaints.length > 0 ? (
                    complaints.map(complain => (
                        <div key={complain._id} className="complain-card">
                            <div className="complain-card-header">
                                <h3>{complain.title}</h3>
                                <span className={`status-badge ${getStatusClass(complain.status)}`}>
                                    {complain.status}
                                </span>
                            </div>
                            <p className="complain-message">{complain.message}</p>
                            <div className="complain-card-footer">
                                <div>
                                    <strong>Student:</strong> {complain.student.name} ({complain.student.rollnumber})
                                    <br />
                                    <strong>Date:</strong> {new Date(complain.createdAt).toLocaleDateString()}
                                </div>
                                <button onClick={() => handleEditClick(complain)} className="respond-button">
                                    Respond
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No complaints found.</p>
                )}
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Respond to Complaint</h2>
                            <button onClick={handleModalClose} className="modal-close-button">&times;</button>
                        </div>
                        <form onSubmit={handleUpdateSubmit}>
                            <div className="modal-body">
                                <label>Response</label>
                                <textarea
                                    value={response}
                                    onChange={(e) => setResponse(e.target.value)}
                                    rows="5"
                                    placeholder="Provide a response to the student..."
                                />
                                <label>Status</label>
                                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                                    <option value="Pending">Pending</option>
                                    <option value="Resolved">Resolved</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={handleModalClose} className="modal-cancel-button">Cancel</button>
                                <button type="submit" className="modal-save-button">Update Status</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewComplaints;