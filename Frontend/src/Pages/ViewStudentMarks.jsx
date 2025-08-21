import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import './ViewStudentMarks.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes, faEdit, faSearch } from '@fortawesome/free-solid-svg-icons';

const ViewStudentMarks = () => {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [editingStudentId, setEditingStudentId] = useState(null);
    const [editableMarks, setEditableMarks] = useState([]);

    const adminData = JSON.parse(localStorage.getItem('admin'));
    const teacherData = JSON.parse(localStorage.getItem('teacher'));

    useEffect(() => {
        const user = adminData || teacherData;
        if (!user) {
            navigate('/select-role');
            return;
        }
        fetchData();
    }, []);

    const fetchData = async () => {
        const user = adminData || teacherData;
        const adminId = adminData ? adminData.id : teacherData.admin._id;
        try {
            const [studentsRes, classesRes] = await Promise.all([
                api.get(`/students/admin/${adminId}/results`),
                api.get(`/class/${adminId}`)
            ]);
            setStudents(studentsRes.data);
            setFilteredStudents(studentsRes.data);
            setClasses(classesRes.data);
        } catch (err) {
            setError('Failed to fetch student data.');
        }
    };

    useEffect(() => {
        let filtered = students;

        if (selectedClass) {
            filtered = filtered.filter(student => student.classname._id === selectedClass);
        }

        if (searchTerm) {
            filtered = filtered.filter(student =>
                student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.rollnumber.toString().includes(searchTerm)
            );
        }

        setFilteredStudents(filtered);
    }, [selectedClass, searchTerm, students]);

    const handleEditClick = (student) => {
        setEditingStudentId(student._id);
        // Deep copy the exam results to avoid direct state mutation
        setEditableMarks(JSON.parse(JSON.stringify(student.examResult)));
    };

    const handleCancelClick = () => {
        setEditingStudentId(null);
        setEditableMarks([]);
    };

    const handleMarkChange = (resultId, newMark) => {
        const markValue = newMark === '' ? '' : parseFloat(newMark);
        if (newMark !== '' && (isNaN(markValue) || markValue < 0 || markValue > 100)) {
            return;
        }

        setEditableMarks(currentMarks =>
            currentMarks.map(mark =>
                mark._id === resultId ? { ...mark, marks: markValue } : mark
            )
        );
    };

    const handleSaveClick = async (studentId) => {
        try {
            const finalMarks = editableMarks.map(mark => ({
                ...mark,
                marks: mark.marks === '' ? 0 : mark.marks
            }));
            await api.put(`/students/${studentId}/results`, { examResults: finalMarks });
            setEditingStudentId(null);
            fetchData(); // Refresh data after saving
        } catch (err) {
            setError('Failed to update marks.');
        }
    };

    const getMarksForTest = (results, subjectName, examType) => {
        const result = results.find(r => r.subject.subjectname === subjectName && r.examType === examType);
        return result || { marks: 0, _id: `${subjectName}-${examType}-${Math.random()}` }; // Ensure a unique key for new entries
    };

    return (
        <div className="view-marks-container">
            <h1>Student Exam Marks</h1>
            <div className="filters">
                <div className="search-wrapper">
                    <FontAwesomeIcon icon={faSearch} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by name or roll number..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select onChange={(e) => setSelectedClass(e.target.value)} value={selectedClass}>
                    <option value="">All Classes</option>
                    {classes.map(c => (
                        <option key={c._id} value={c._id}>{c.classname}</option>
                    ))}
                </select>
            </div>
            {error && <p className="error-message">{error}</p>}
            <div className="student-cards-container">
                {filteredStudents.map(student => (
                    <div key={student._id} className="student-card">
                        <div className="student-card-header">
                            <div>
                                <h3>{student.name}</h3>
                                <p>Roll No: {student.rollnumber} | Class: {student.classname.classname}</p>
                            </div>
                            <div className="actions">
                                {editingStudentId === student._id ? (
                                    <>
                                        <button className="save-btn" onClick={() => handleSaveClick(student._id)}><FontAwesomeIcon icon={faSave} /> Save</button>
                                        <button className="cancel-btn" onClick={handleCancelClick}><FontAwesomeIcon icon={faTimes} /> Cancel</button>
                                    </>
                                ) : (
                                    <button className="edit-btn" onClick={() => handleEditClick(student)}><FontAwesomeIcon icon={faEdit} /> Edit</button>
                                )}
                            </div>
                        </div>
                        <div className="marks-grid">
                            {['DM', 'PYTHON', 'TOC', 'COA', 'FSD'].map(subject => {
                                const results = editingStudentId === student._id ? editableMarks : student.examResult;
                                return (
                                    <div key={subject} className="subject-marks">
                                        <h4>{subject}</h4>
                                        <div className="tests">
                                            {['T1', 'T2', 'T3', 'T4'].map(test => {
                                                const result = getMarksForTest(results, subject, test);
                                                const displayMarks = editingStudentId === student._id 
                                                    ? (editableMarks.find(m => m._id === result._id)?.marks ?? '')
                                                    : result.marks;

                                                return (
                                                    <div key={test} className="test-mark">
                                                        <label>{test}</label>
                                                        {editingStudentId === student._id ? (
                                                            <input
                                                                type="number"
                                                                step="0.5"
                                                                value={displayMarks}
                                                                onChange={(e) => handleMarkChange(result._id, e.target.value)}
                                                                className="marks-input"
                                                            />
                                                        ) : (
                                                            <span>{result.marks}</span>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ViewStudentMarks;
