import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import pythonApi from '../../api/pythonApi';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './PerformanceAnalysis.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faChartPie, faExclamationTriangle, faTrophy, faSearch } from '@fortawesome/free-solid-svg-icons';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PerformanceAnalysis = () => {
    const [performanceData, setPerformanceData] = useState([]);
    const [subjectInsights, setSubjectInsights] = useState(null);
    const [atRiskStudents, setAtRiskStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // New state for interactive features
    const [rankingSearchTerm, setRankingSearchTerm] = useState('');
    const [atRiskThreshold, setAtRiskThreshold] = useState(60);

    const fetchAtRiskStudents = useCallback(async (threshold) => {
        try {
            const atRiskRes = await pythonApi.get(`/at-risk?threshold=${threshold}`);
            setAtRiskStudents(atRiskRes.data);
        } catch (err) {
            setError('Failed to update at-risk students. Please ensure the analysis service is running.');
        }
    }, []);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(true);
                const [perfRes, insightsRes, atRiskRes] = await Promise.all([
                    pythonApi.get('/performance'),
                    pythonApi.get('/subject-insights'),
                    pythonApi.get(`/at-risk?threshold=${atRiskThreshold}`)
                ]);
                setPerformanceData(perfRes.data);
                setSubjectInsights(insightsRes.data);
                setAtRiskStudents(atRiskRes.data);
            } catch (err) {
                setError('Failed to connect to the analysis service. Please ensure it is running.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    // Debounce the API call for the threshold slider
    useEffect(() => {
        const handler = setTimeout(() => {
            fetchAtRiskStudents(atRiskThreshold);
        }, 500); // 500ms delay

        return () => {
            clearTimeout(handler);
        };
    }, [atRiskThreshold, fetchAtRiskStudents]);

    const filteredPerformanceData = useMemo(() => {
        if (!rankingSearchTerm) {
            return performanceData;
        }
        return performanceData.filter(student =>
            student.NAME.toLowerCase().includes(rankingSearchTerm.toLowerCase()) ||
            student['Roll Number'].toString().includes(rankingSearchTerm)
        );
    }, [rankingSearchTerm, performanceData]);

    const subjectChartData = {
        labels: subjectInsights ? Object.keys(subjectInsights) : [],
        datasets: [
            {
                label: 'Average Subject Performance (%)',
                data: subjectInsights ? Object.values(subjectInsights) : [],
                backgroundColor: 'rgba(79, 70, 229, 0.7)',
                borderColor: 'rgba(79, 70, 229, 1)',
                borderWidth: 1,
            },
        ],
    };

    if (loading) {
        return <div className="loading-container">Loading Analysis...</div>;
    }

    if (error) {
        return <div className="error-container">{error}</div>;
    }

    return (
        <div className="analysis-container">
            <div className="analysis-header">
                <h1><FontAwesomeIcon icon={faChartPie} /> Student Performance Analysis</h1>
                <Link to="/hod" className="back-link-analysis">
                    <FontAwesomeIcon icon={faArrowLeft} /> Back to Dashboard
                </Link>
            </div>

            <div className="analysis-card">
                <div className="card-header-controls">
                    <h2><FontAwesomeIcon icon={faExclamationTriangle} /> At-Risk Students</h2>
                    <div className="threshold-control">
                        <label htmlFor="risk-threshold">Threshold: {atRiskThreshold}%</label>
                        <input
                            id="risk-threshold"
                            type="range"
                            min="0"
                            max="100"
                            value={atRiskThreshold}
                            onChange={(e) => setAtRiskThreshold(e.target.value)}
                        />
                    </div>
                </div>
                <div className="table-container">
                    <table className="analysis-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Roll Number</th>
                                <th>Class</th>
                                <th>Percentage</th>
                            </tr>
                        </thead>
                        <tbody>
                            {atRiskStudents.length > 0 ? atRiskStudents.map((student, index) => (
                                <tr key={index}>
                                    <td>{student.NAME}</td>
                                    <td>{student['Roll Number']}</td>
                                    <td>{student.Class}</td>
                                    <td>{student.Percentage.toFixed(2)}%</td>
                                </tr>
                            )) : <tr><td colSpan="4">No students are currently below the selected threshold.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div className="analysis-card">
                 <h2><FontAwesomeIcon icon={faChartPie} /> Subject Performance Insights</h2>
                <div className="chart-container">
                    {subjectInsights && <Bar data={subjectChartData} />}
                </div>
            </div>

            <div className="analysis-card">
                <h2><FontAwesomeIcon icon={faTrophy} /> Overall Student Rankings</h2>
                <div className="search-bar-wrapper">
                    <FontAwesomeIcon icon={faSearch} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by Name or Roll Number..."
                        className="analysis-search-bar"
                        value={rankingSearchTerm}
                        onChange={(e) => setRankingSearchTerm(e.target.value)}
                    />
                </div>
                <div className="table-container">
                     <table className="analysis-table">
                        <thead>
                            <tr>
                                <th>Overall Rank</th>
                                <th>Name</th>
                                <th>Class</th>
                                <th>Class Rank</th>
                                <th>Percentage</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPerformanceData.map((student, index) => (
                                <tr key={index}>
                                    <td>{student['Overall Rank']}</td>
                                    <td>{student.NAME}</td>
                                    <td>{student.Class}</td>
                                    <td>{student['Class Rank']}</td>
                                    <td>{student.Percentage.toFixed(2)}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PerformanceAnalysis;
