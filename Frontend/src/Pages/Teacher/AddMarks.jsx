import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/api';
import './AddMarks.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const AddMarks = () => {
    const { classId, subjectId } = useParams();
    const [students, setStudents] = useState([]);
    const [marksData, setMarksData] = useState({});
    const [classInfo, setClassInfo] = useState(null);
    const [subjectInfo, setSubjectInfo] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchMarksForStudents = useCallback(async (studentList) => {
        const marks = {};
        for (const student of studentList) {
            try {
                const res = await api.get(`/students/${student._id}/results`);
                const subjectResults = res.data.filter(r => r.subject._id === subjectId);
                marks[student._id] = {
                    T1: subjectResults.find(r => r.examType === 'T1')?.marks ?? '',
                    T2: subjectResults.find(r => r.examType === 'T2')?.marks ?? '',
                    T3: subjectResults.find(r => r.examType === 'T3')?.marks ?? '',
                    T4: subjectResults.find(r => r.examType === 'T4')?.marks ?? '',
                };
            } catch (err) {
                console.error(`Failed to fetch marks for ${student.name}`, err);
                marks[student._id] = { T1: '', T2: '', T3: '', T4: '' };
            }
        }
        setMarksData(marks);
    }, [subjectId]);

    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            try {
                const [studentsRes, classRes, subjectRes] = await Promise.all([
                    api.get(`/students/class/${classId}`),
                    api.get(`/class/detail/${classId}`),
                    api.get(`/subjects/${subjectId}`)
                ]);

                setStudents(studentsRes.data);
                setClassInfo(classRes.data);
                setSubjectInfo(subjectRes.data);
                await fetchMarksForStudents(studentsRes.data);

            } catch (err) {
                setError('Failed to fetch initial data.');
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, [classId, subjectId, fetchMarksForStudents]);

    const handleMarkChange = (studentId, examType, value) => {
        // Use parseFloat to handle decimal values
        const marks = value === '' ? '' : parseFloat(value);
        if (isNaN(marks) || marks > 100 || marks < 0) return;

        setMarksData(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                [examType]: marks,
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const updatePromises = students.map(student => {
            const studentMarks = marksData[student._id];
            const marksPayload = Object.keys(studentMarks).map(examType => ({
                examType,
                marks: studentMarks[examType] === '' ? 0 : studentMarks[examType],
            }));
            return api.put(`/students/${student._id}/subjects/${subjectId}/marks`, { marks: marksPayload });
        });

        try {
            await Promise.all(updatePromises);
            setSuccess('All marks have been saved successfully!');
        } catch (err) {
            setError('An error occurred while saving marks.');
        }
    };

    if (loading) {
        return <div className="loading-container">Loading...</div>;
    }

    return (
        <div className="add-marks-container">
            <div className="add-marks-header">
                <div>
                    <h1>Add/Edit Marks</h1>
                    <p><strong>Class:</strong> {classInfo?.classname} | <strong>Subject:</strong> {subjectInfo?.subjectname}</p>
                </div>
                <Link to={`/teacher/class/${classId}/subject/${subjectId}`} className="back-link">
                    <FontAwesomeIcon icon={faArrowLeft} /> Back
                </Link>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="marks-table-container">
                    <table className="marks-table">
                        <thead>
                            <tr>
                                <th>Student Name</th>
                                <th>T1</th>
                                <th>T2</th>
                                <th>T3</th>
                                <th>T4</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(student => (
                                <tr key={student._id}>
                                    <td>{student.name}</td>
                                    {['T1', 'T2', 'T3', 'T4'].map(test => (
                                        <td key={test}>
                                            <input
                                                type="number"
                                                step="0.5"
                                                className="marks-input"
                                                value={marksData[student._id]?.[test] ?? ''}
                                                onChange={(e) => handleMarkChange(student._id, test, e.target.value)}
                                                placeholder="-"
                                                max="100"
                                                min="0"
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {error && <p className="message error">{error}</p>}
                {success && <p className="message success">{success}</p>}
                
                <button type="submit" className="save-button">
                    <FontAwesomeIcon icon={faSave} /> Save All Changes
                </button>
            </form>
        </div>
    );
};

export default AddMarks;
