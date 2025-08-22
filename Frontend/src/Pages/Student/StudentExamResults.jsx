import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/api';
import './StudentExamResults.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faChartBar } from '@fortawesome/free-solid-svg-icons';

const StudentExamResults = () => {
    const [examResults, setExamResults] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const studentData = JSON.parse(localStorage.getItem('student'));

    useEffect(() => {
        if (!studentData || !studentData._id) {
            navigate('/student/login');
            return;
        }

        const fetchExamResults = async () => {
            try {
                const response = await api.get(`/students/${studentData._id}/results`);
                // Group results by subject
                const groupedResults = response.data.reduce((acc, result) => {
                    const subjectName = result.subject.subjectname;
                    if (!acc[subjectName]) {
                        acc[subjectName] = [];
                    }
                    acc[subjectName].push(result);
                    return acc;
                }, {});
                setExamResults(groupedResults);
            } catch (err) {
                setError('Failed to fetch exam results.');
            }
        };

        fetchExamResults();
    }, [studentData, navigate]);

    return (
        <div className="exam-results-container">
            
            <button className="back-button" onClick={() => navigate('/student')}>
                <FontAwesomeIcon icon={faArrowLeft} /> Back
            </button>

            <div className="exam-results-header">
                <h1><FontAwesomeIcon icon={faChartBar} /> My Exam Results</h1>
            </div>
            {error && <p className="error-message">{error}</p>}
            
            <div className="results-grid">
                {Object.keys(examResults).length > 0 ? (
                    Object.keys(examResults).map(subjectName => (
                        <div key={subjectName} className="subject-marks-card">
                            <h2>{subjectName} ({examResults[subjectName][0].subject.subjectcode})</h2>
                            <table className="marks-table">
                                <thead>
                                    <tr>
                                        <th>Exam Type</th>
                                        <th>Marks</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {examResults[subjectName].map((result, index) => (
                                        <tr key={index}>
                                            <td>{result.examType}</td>
                                            <td>{result.marks}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))
                ) : (
                    <p>No exam results have been published yet.</p>
                )}
            </div>
        </div>
    );
};

export default StudentExamResults;
