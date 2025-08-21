import React,{useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import pythonApi from '../../api/pythonApi';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './PerformanceAnalysis.css'; // Reusing the same CSS for a consistent look
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faChalkboard, faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ClassAnalysis = () => {
    const [classPerformance, setClassPerformance] = useState([]);
    const [teacherPerformance, setTeacherPerformance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [classRes, teacherRes] = await Promise.all([
                    pythonApi.get('/class-performance'),
                    pythonApi.get('/teacher-performance')
                ]);
                setClassPerformance(classRes.data);
                setTeacherPerformance(teacherRes.data);
            } catch (err) {
                setError('Failed to connect to the analysis service. Please ensure it is running.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const classChartData = {
        labels: classPerformance.map(c => c._id),
        datasets: [{
            label: 'Average Class Marks (%)',
            data: classPerformance.map(c => c.AverageMarks),
            backgroundColor: 'rgba(54, 162, 235, 0.7)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
        }],
    };

    const teacherChartData = {
        labels: teacherPerformance.map(t => t._id),
        datasets: [{
            label: 'Average Marks in Subjects Taught (%)',
            data: teacherPerformance.map(t => t.AverageMarks),
            backgroundColor: 'rgba(255, 99, 132, 0.7)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
        }],
    };

    if (loading) {
        return <div className="loading-container">Loading Class Analysis...</div>;
    }

    if (error) {
        return <div className="error-container">{error}</div>;
    }

    return (
        <div className="analysis-container">
            <div className="analysis-header">
                <h1><FontAwesomeIcon icon={faChalkboard} /> Class & Teacher Insights</h1>
                <Link to="/hod" className="back-link-analysis">
                    <FontAwesomeIcon icon={faArrowLeft} /> Back to Dashboard
                </Link>
            </div>

            {/* Class Performance Section */}
            <div className="analysis-card">
                <h2><FontAwesomeIcon icon={faChalkboard} /> Class Performance Comparison</h2>
                <div className="chart-container">
                    {classPerformance.length > 0 ? <Bar data={classChartData} /> : <p>No class performance data available.</p>}
                </div>
            </div>
            
            {/* Teacher Performance Section */}
            <div className="analysis-card">
                 <h2><FontAwesomeIcon icon={faChalkboardTeacher} /> Teacher Performance Overview</h2>
                <div className="chart-container">
                    {teacherPerformance.length > 0 ? <Bar data={teacherChartData} /> : <p>No teacher performance data available.</p>}
                </div>
            </div>
        </div>
    );
};

export default ClassAnalysis;
