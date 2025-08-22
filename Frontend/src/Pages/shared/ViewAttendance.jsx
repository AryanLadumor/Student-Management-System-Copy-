import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/api';
import './ViewAttendance.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faArrowLeft, faFilePdf, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { generatePDF, generateAbsenteesPDF } from '../../utils/pdfGenerator';

const SkeletonLoader = () => (
    <div className="view-attendance-container skeleton-loading">
        <div className="view-attendance-header">
            <div className="skeleton skeleton-title"></div>
            <div className="skeleton skeleton-button"></div>
        </div>

        <div className="attendance-filters">
            <div className="skeleton skeleton-filter"></div>
            <div className="skeleton skeleton-filter"></div>
            <div className="skeleton skeleton-filter"></div>
            <div className="skeleton skeleton-button-small"></div>
            <div className="skeleton skeleton-button-large"></div>
            <div className="skeleton skeleton-button-large"></div>
        </div>

        <div className="attendance-table-container">
            <table className="attendance-table-view">
                <thead>
                    <tr>
                        {[...Array(6)].map((_, i) => <th key={i}><div className="skeleton skeleton-text"></div></th>)}
                    </tr>
                </thead>
                <tbody>
                    {[...Array(8)].map((_, i) => (
                        <tr key={i}>
                            <td><div className="skeleton skeleton-text"></div></td>
                            <td><div className="skeleton skeleton-text"></div></td>
                            <td><div className="skeleton skeleton-text"></div></td>
                            <td><div className="skeleton skeleton-text"></div></td>
                            <td><div className="skeleton skeleton-text"></div></td>
                            <td><div className="skeleton skeleton-text"></div></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);


const ViewAttendance = ({ userRole }) => {
    const [records, setRecords] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const observer = useRef();

    // Filters
    const [allClasses, setAllClasses] = useState([]);
    const [allSubjects, setAllSubjects] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    
    const userData = useMemo(() => {
        const data = localStorage.getItem(userRole);
        return data ? JSON.parse(data) : null;
    }, [userRole]);

    const fetchData = useCallback(async (pageNum, isNewFilter) => {
        if (!userData) return;
        setLoading(true);
        if (isNewFilter) setInitialLoad(true);

        try {
            const userId = userRole === 'admin' ? userData.id : userData._id;
            const params = new URLSearchParams({ page: pageNum });
            if (selectedClass) params.append('classId', selectedClass);
            if (selectedSubject) params.append('subjectId', selectedSubject);
            if (selectedDate) params.append('date', selectedDate);

            const endpoint = `/attendance/${userRole}/${userId}?${params.toString()}`;
            const res = await api.get(endpoint);
            
            setRecords(prev => (pageNum === 1 ? res.data.records : [...prev, ...res.data.records]));
            setHasMore(res.data.hasMore);
        } catch (err) {
            setError('Failed to fetch attendance records.');
            if (pageNum === 1) setRecords([]);
        } finally {
            setLoading(false);
            if (isNewFilter) setInitialLoad(false);
        }
    }, [userRole, userData, selectedClass, selectedSubject, selectedDate]);

     useEffect(() => {
        if (!userData) {
            navigate('/select-role');
            return;
        }

        const fetchFilterData = async () => {
            const adminId = userRole === 'admin' ? userData.id : userData.admin._id;
            const [classesRes, subjectsRes] = await Promise.all([
                api.get(`/class/${adminId}`),
                api.get(`/subjects/admin/${adminId}`)
            ]);
            setAllClasses(classesRes.data);
            setAllSubjects(subjectsRes.data);
        };
        
        fetchFilterData();
        fetchData(1, true);
    }, [userRole, userData, navigate]);


    useEffect(() => {
        // Refetch when filters change
        setPage(1);
        setRecords([]);
        fetchData(1, true);
    }, [selectedClass, selectedSubject, selectedDate, fetchData]);

    useEffect(() => {
        if (page > 1) {
            fetchData(page, false);
        }
    }, [page, fetchData]);
    
    const lastElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);
    
    const dashboardPath = userRole === 'admin' ? '/hod' : '/teacher/dashboard';

    const handleDownload = () => generatePDF(records); // Download all loaded records
    const handleDownloadAbsentees = () => generateAbsenteesPDF(records);

    if (initialLoad) return <SkeletonLoader />;

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
                    {allClasses.map(c => <option key={c._id} value={c._id}>{c.classname}</option>)}
                </select>
                <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)}>
                    <option value="">All Subjects</option>
                    {allSubjects.map(s => <option key={s._id} value={s._id}>{s.subjectname}</option>)}
                </select>
                <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
                <button onClick={() => {setSelectedClass(''); setSelectedSubject(''); setSelectedDate('');}}>Clear Filters</button>
                 <button onClick={handleDownload} className="download-btn">
                    <FontAwesomeIcon icon={faFilePdf} /> Download Full Report (PDF)
                </button>
                <button onClick={handleDownloadAbsentees} className="download-btn-absent">
                    <FontAwesomeIcon icon={faFilePdf} /> Download Absentees Report (PDF)
                </button>
            </div>

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
                        {records.length > 0 ? (
                            records.map((record, index) => (
                                <tr ref={records.length === index + 1 ? lastElementRef : null} key={record._id}>
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
                            ))
                        ) : (
                             <tr>
                                <td colSpan="6">
                                    {error ? error : "No attendance records found for the selected filters."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                 {loading && !initialLoad && <div className="loading-more"><FontAwesomeIcon icon={faSpinner} spin /> Loading more...</div>}
                 {!hasMore && records.length > 0 && <div className="end-of-records">End of records</div>}
            </div>
        </div>
    );
};

export default ViewAttendance;