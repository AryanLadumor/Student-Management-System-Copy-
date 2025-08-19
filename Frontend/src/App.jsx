// import { useState } from 'react'
// import './App.css'
import Dashboard from "./Pages/Dashboard"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from "./Pages/LandingPage";
import SelectRolePage from "./Pages/SelectRolePage";
import StudentDashboard from "./Pages/StudentDashboard";
import TeacherDashboard from "./Pages/TeacherDashboard";
function App() {
  return (
    <>
      <Router>
            {/* <div className="App"> */}
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    {/* Add routes for other pages here as you create them */}
                    <Route path="/select-role" element={<SelectRolePage />} />
                    {/* <Route path="/login/student" element={<StudentLoginPage />} /> */}
                    {/* <Route path="/login/teacher" element={<TeacherLoginPage />} /> */}
                    {/* <Route path="/login/hod" element={<HodLoginPage />} /> */}
                    <Route path="/student" element={<StudentDashboard />} />
                    <Route path="/teacher" element={<TeacherDashboard />} />
                    <Route path="/hod" element={<StudentDashboard />} />
                    
                    {/* Protected routes for dashboards will come later */}
                </Routes>
            {/* </div> */}
        </Router>
    </>
  )
}

export default App
