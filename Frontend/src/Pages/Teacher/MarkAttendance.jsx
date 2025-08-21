import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../api/api';
import './MarkAttendance.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const MarkAttendance = () => {
    const { classId, subjectId } = useParams();
    const [students, setStudents] = useState([]);
    const [classInfo, setClassInfo] = useState(null);
    const [subjectInfo, setSubjectInfo] = useState(null);
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    const [attendance, setAttendance] = useState({});
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClassData = async () => {
            try {
                const [studentsRes, classRes, subjectRes] = await Promise.all([
                    api.get(`/students/class/${classId}`),
                    api.get(`/class/detail/${classId}`),
                    api.get(`/subjects/${subjectId}`)
                ]);
                
                setStudents(studentsRes.data);
                setClassInfo(classRes.data);
                setSubjectInfo(subjectRes.data);

                const initialAttendance = {};
                studentsRes.data.forEach(student => {
                    initialAttendance[student._id] = 'Present';
                });
                setAttendance(initialAttendance);
            } catch (err) {
                setError('Failed to fetch class data.');
            }
        };
        fetchClassData();
    }, [classId, subjectId]);

    const handleStatusChange = (studentId, status) => {
        setAttendance(prev => ({ ...prev, [studentId]: status }));
    };
    
    const markAll = (status) => {
        const newAttendance = {};
        students.forEach(student => {
            newAttendance[student._id] = status;
        });
        setAttendance(newAttendance);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const attendanceData = Object.keys(attendance).map(studentId => ({
            studentId,
            status: attendance[studentId],
        }));

        try {
            await api.post('/attendance/mark', {
                attendanceData,
                subjectId,
                date,
            });
            setSuccess('Attendance submitted successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to submit attendance.');
        }
    };

    return (
        <div className="attendance-container">
            <div className="attendance-header">
                <div>
                    <h1>Mark Attendance</h1>
                    <p>
                        <strong>Class:</strong> {classInfo?.classname || '...'} | <strong>Subject:</strong> {subjectInfo?.subjectname || '...'}
                    </p>
                </div>
                <Link to={`/teacher/class/${classId}/subject/${subjectId}`} className="back-button">
                    Back to Students
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="attendance-form">
                <div className="controls-bar">
                    <div className="date-picker">
                        <FontAwesomeIcon icon={faCalendarAlt} />
                        <input
                            type="date"
                            id="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className="bulk-actions">
                        <button type="button" onClick={() => markAll('Present')}>Mark All Present</button>
                        <button type="button" onClick={() => markAll('Absent')}>Mark All Absent</button>
                    </div>
                </div>

                {error && <p className="message error">{error}</p>}
                {success && <p className="message success">{success}</p>}

                <div className="student-list">
                    {students.map(student => (
                        <div key={student._id} className="student-row">
                            <span className="student-name">{student.name}</span>
                            <div className="status-toggle">
                                <label className={`status-label ${attendance[student._id] === 'Present' ? 'present' : ''}`}>
                                    <input
                                        type="radio"
                                        name={`attendance-${student._id}`}
                                        value="Present"
                                        checked={attendance[student._id] === 'Present'}
                                        onChange={() => handleStatusChange(student._id, 'Present')}
                                    />
                                    <FontAwesomeIcon icon={faCheckCircle} /> Present
                                </label>
                                <label className={`status-label ${attendance[student._id] === 'Absent' ? 'absent' : ''}`}>
                                    <input
                                        type="radio"
                                        name={`attendance-${student._id}`}
                                        value="Absent"
                                        checked={attendance[student._id] === 'Absent'}
                                        onChange={() => handleStatusChange(student._id, 'Absent')}
                                    />
                                    <FontAwesomeIcon icon={faTimesCircle} /> Absent
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
                <button type="submit" className="submit-button">Submit Attendance</button>
            </form>
        </div>
    );
};

export default MarkAttendance;
