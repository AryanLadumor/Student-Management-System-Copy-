import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import pythonApi from '../../api/pythonApi';
import './PerformanceAnalysis.css'; // Reusing styles
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faBrain, faChartLine, faSearch } from '@fortawesome/free-solid-svg-icons';

const PredictiveAnalysis = () => {
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchPredictions = async () => {
            try {
                setLoading(true);
                const res = await pythonApi.get('/predict-performance');
                if (res.data.error) {
                    setError(res.data.error);
                } else {
                    const sortedData = res.data.sort((a, b) => a.Predicted_Overall_Percentage - b.Predicted_Overall_Percentage);
                    setPredictions(sortedData);
                }
            } catch (err) {
                setError('Failed to connect to the analysis service.');
            } finally {
                setLoading(false);
            }
        };
        fetchPredictions();
    }, []);

    const filteredPredictions = useMemo(() => {
        if (!searchTerm) {
            return predictions;
        }
        return predictions.filter(student =>
            student['Roll Number'].toString().includes(searchTerm)
        );
    }, [searchTerm, predictions]);

    if (loading) {
        return <div className="loading-container">Running Predictions...</div>;
    }

    if (error) {
        return <div className="error-container">{error}</div>;
    }

    return (
        <div className="analysis-container">
            <div className="analysis-header">
                <h1><FontAwesomeIcon icon={faBrain} /> Predictive Analysis</h1>
                <Link to="/hod" className="back-link-analysis">
                    <FontAwesomeIcon icon={faArrowLeft} /> Back to Dashboard
                </Link>
            </div>

            <div className="analysis-card">
                <h2><FontAwesomeIcon icon={faChartLine} /> Forecasted Student Performance</h2>
                <p className="analysis-subtitle">
                    Based on T1 & T2 marks, these are the predicted overall percentages for the semester. Students with a forecasted score below 60% are highlighted as potentially at-risk.
                </p>

                <div className="search-bar-wrapper">
                     <FontAwesomeIcon icon={faSearch} className="search-icon" />
                     <input
                        type="text"
                        placeholder="Search by Roll Number..."
                        className="analysis-search-bar"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="table-container">
                    <table className="analysis-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Roll Number</th>
                                <th>Class</th>
                                <th>Predicted Percentage</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPredictions.length > 0 ? filteredPredictions.map((student, index) => (
                                <tr key={index} className={student.Predicted_Overall_Percentage < 60 ? 'at-risk-row' : ''}>
                                    <td>{student.NAME}</td>
                                    <td>{student['Roll Number']}</td>
                                    <td>{student.Class}</td>
                                    <td>
                                        <strong>{student.Predicted_Overall_Percentage.toFixed(2)}%</strong>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4">No students found with that roll number.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PredictiveAnalysis;
