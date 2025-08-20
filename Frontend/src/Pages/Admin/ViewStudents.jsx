import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/api';
import './View.css';
import './Modal.css'; // Import modal styles

const ViewStudents = () => {
    const [students, setStudents] = useState([]);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    
    // State for modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentStudent, setCurrentStudent] = useState(null);
    const [updatedData, setUpdatedData] = useState({ name: '', rollnumber: '', classname: '' });
    const [allClasses, setAllClasses] = useState([]);

    const adminData = JSON.parse(localStorage.getItem('admin'));
    const adminId = adminData ? adminData.id : null;

    useEffect(() => {
        if (!adminId) {
            setError("Admin details not found. Please log in again.");
            return;
        }

        const fetchData = async () => {
            try {
                // Fetch both students and classes at the same time
                const [studentsRes, classesRes] = await Promise.all([
                    api.get(`/students/institute/${adminId}/`),
                    api.get(`/class/${adminId}`)
                ]);
                setStudents(studentsRes.data);
                setAllClasses(classesRes.data);
            } catch (err) {
                setError('Failed to fetch data.');
                console.error("Error fetching data:", err);
            }
        };

        fetchData();
    }, [adminId]);
    
    // (Your existing handleDelete function remains here)
    const handleDelete = async (studentId) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                await api.delete(`/students/${studentId}`);
                setStudents(students.filter(s => s._id !== studentId));
            } catch (err) {
                setError('Failed to delete student.');
            }
        }
    };

    // --- NEW FUNCTIONS FOR MODAL ---
    const handleEditClick = (student) => {
        setCurrentStudent(student);
        setUpdatedData({
            name: student.name,
            rollnumber: student.rollnumber,
            classname: student.classname?._id || ''
        });
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setCurrentStudent(null);
    };
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put(`/students/${currentStudent._id}`, updatedData);
            setStudents(students.map(s => 
                s._id === currentStudent._id ? response.data.student : s
            ));
            handleModalClose();
        } catch (err) {
            setError('Failed to update student.');
            console.error("Error updating student:", err);
        }
    };
    
    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollnumber.toString().includes(searchTerm)
    );

    return (
        <div className="view-container">
            {/* Header and search bar remain the same */}
            <div className="view-header">
                <h1>Manage Students</h1>
                <Link to="/admin/add-student" className="add-button">Add New Student</Link>
            </div>
            <input 
                type="text"
                placeholder="Search by name or roll number..."
                className="search-bar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {error && <p className="error-message">{error}</p>}
            
            <div className="view-table-container">
                <table className="view-table">
                    {/* ... table head ... */}
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Roll Number</th>
                            <th>Class</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.length > 0 ? (
                            filteredStudents.map((student) => (
                                <tr key={student._id}>
                                    <td>{student.name}</td>
                                    <td>{student.rollnumber}</td>
                                    <td>{student.classname ? student.classname.classname : 'N/A'}</td>
                                    <td>
                                        <button className="edit-button" onClick={() => handleEditClick(student)}>Edit</button>
                                        <button className="delete-button" onClick={() => handleDelete(student._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">No students found.</td>
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
                            <h2>Edit Student</h2>
                            <button onClick={handleModalClose} className="modal-close-button">&times;</button>
                        </div>
                        <form onSubmit={handleUpdateSubmit}>
                            <div className="modal-body">
                                <label>Name</label>
                                <input type="text" name="name" value={updatedData.name} onChange={handleInputChange} required />
                                <label>Roll Number</label>
                                <input type="number" name="rollnumber" value={updatedData.rollnumber} onChange={handleInputChange} required />
                                <label>Class</label>
                                <select name="classname" value={updatedData.classname} onChange={handleInputChange} required>
                                    <option value="">Select a Class</option>
                                    {allClasses.map(c => (
                                        <option key={c._id} value={c._id}>{c.classname}</option>
                                    ))}
                                </select>
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

export default ViewStudents;