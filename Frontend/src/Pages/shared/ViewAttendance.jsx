import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/api';
import './ViewAttendance.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const ViewAttendance = ({ userRole }) => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Filters
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    
    const userData = JSON.parse(localStorage.getItem(userRole));

    useEffect(() => {
        if (!userData) {
            navigate('/select-role');
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                const userId = userRole === 'admin' ? userData.id : userData._id;
                const endpoint = `/attendance/${userRole}/${userId}`;
                const res = await api.get(endpoint);
                setRecords(res.data);
            } catch (err) {
                setError('Failed to fetch attendance records. Data will appear here once attendance is marked.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userRole, userData, navigate]);

    const uniqueClasses = useMemo(() => [...new Set(records.map(r => r.className))].sort(), [records]);
    const uniqueSubjects = useMemo(() => [...new Set(records.map(r => r.subjectName))].sort(), [records]);

    const filteredRecords = useMemo(() => {
        return records.filter(record => {
            const recordDate = new Date(record.date).toISOString().split('T')[0];
            return (
                (selectedClass ? record.className === selectedClass : true) &&
                (selectedSubject ? record.subjectName === selectedSubject : true) &&
                (selectedDate ? recordDate === selectedDate : true)
            );
        });
    }, [records, selectedClass, selectedSubject, selectedDate]);
    
    const dashboardPath = userRole === 'admin' ? '/hod' : '/teacher/dashboard';

    if (loading) return <div className="loading-container">Loading Attendance Data...</div>;

    return (
        <div className="view-attendance-container">
            <div className="view-attendance-header">
                <h1><FontAwesomeIcon icon={faCalendarDays} /> Attendance Records</h1>
                <Link to={dashboardPath} className="back-link-attendance">
                    <FontAwesomeIcon icon={faArrowLeft} /> Back to Dashboard
                </Link>
            </div>

            <div className="attendance-filters">
                <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
                    <option value="">All Classes</option>
                    {uniqueClasses.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)}>
                    <option value="">All Subjects</option>
                    {uniqueSubjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
                <button onClick={() => {setSelectedClass(''); setSelectedSubject(''); setSelectedDate('');}}>Clear Filters</button>
            </div>

            {error && records.length === 0 && <div className="error-container">{error}</div>}

            <div className="attendance-table-container">
                <table className="attendance-table-view">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Student Name</th>
                            <th>Roll Number</th>
                            <th>Class</th>
                            <th>Subject</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRecords.length > 0 ? filteredRecords.map((record) => (
                            <tr key={record._id}>
                                <td>{new Date(record.date).toLocaleDateString()}</td>
                                <td>{record.studentName}</td>
                                <td>{record.rollNumber}</td>
                                <td>{record.className}</td>
                                <td>{record.subjectName}</td>
                                <td>
                                    <span className={`status-badge ${record.status.toLowerCase()}`}>
                                        {record.status}
                                    </span>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6">No records found for the selected filters.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ViewAttendance;
