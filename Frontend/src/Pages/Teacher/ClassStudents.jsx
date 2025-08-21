import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/api';
import '../Admin/View.css'; // Reusing admin view styles

const ClassStudents = () => {
    const { classId, subjectId } = useParams(); // Get IDs from URL
    const [students, setStudents] = useState([]);
    const [classInfo, setClassInfo] = useState(null);
    const [subjectInfo, setSubjectInfo] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch students for the class
                const studentsRes = await api.get(`/students/class/${classId}`);
                setStudents(studentsRes.data);

                // Fetch class and subject details for display
                const classRes = await api.get(`/class/detail/${classId}`);
                setClassInfo(classRes.data);
                
                const subjectRes = await api.get(`/subjects/${subjectId}`);
                setSubjectInfo(subjectRes.data);

            } catch (err) {
                setError('Failed to fetch data for this class.');
                console.error(err);
            }
        };

        fetchData();
    }, [classId, subjectId]);

    return (
        <div className="view-container">
            <div className="view-header">
                <div>
                    <h1>{classInfo ? classInfo.classname : 'Class'} Students</h1>
                    <p style={{marginTop: '0.5rem'}}>Managing Subject: <strong>{subjectInfo ? subjectInfo.subjectname : '...'}</strong></p>
                </div>
                <div>
                    <Link to={`/teacher/class/${classId}/subject/${subjectId}/attendance`} className="add-button" style={{marginRight: '1rem'}}>
                        Mark Attendance
                    </Link>
                    <Link to={`/teacher/class/${classId}/subject/${subjectId}/add-marks`} className="add-button" style={{marginRight: '1rem'}}>
                       Add/Edit Marks
                   </Link>
                    <Link to="/teacher/dashboard" className="add-button" style={{backgroundColor: '#6c757d'}}>Back to Dashboard</Link>
                </div>
            </div>
            {error && <p className="error-message">{error}</p>}
            <div className="view-table-container">
                <table className="view-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Roll Number</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.length > 0 ? (
                            students.map((student) => (
                                <tr key={student._id}>
                                    <td>{student.name}</td>
                                    <td>{student.rollnumber}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="2">No students found in this class.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ClassStudents;
