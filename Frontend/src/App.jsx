// import { useState } from 'react'
// import './App.css'
import Dashboard from "./Pages/Dashboard"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from "./Pages/LandingPage";
import SelectRolePage from "./Pages/SelectRolePage";
import StudentDashboard from "./Pages/StudentDashboard";
import TeacherDashboard from "./Pages/TeacherDashboard";
import HodDashboard from "./Pages/HODDashboard";
import AdminLogin from "./Pages/Admin/AdminLogin";
import AdminRegister from "./Pages/Admin/AdminRegister";
import AddStudent from "./Pages/Admin/AddStudent"; 
import AddClass from "./Pages/Admin/AddClass"; 
import AddSubject from './Pages/Admin/AddSubject';
import AddTeacher from './Pages/Admin/AddTeacher';
import AddNotice from './Pages/Admin/AddNotice';
import ViewClasses from './Pages/Admin/ViewClasses';
import ViewStudents from './Pages/Admin/ViewStudents';
import ViewTeachers from './Pages/Admin/ViewTeachers'; 
import ViewSubjects from './Pages/Admin/ViewSubjects'; 

import TeacherLogin from "./Pages/Teacher/TeacherLogin"; 
import ClassStudents from './Pages/Teacher/ClassStudents';

function App() {
  return (
    <>
      <Router>
            {/* <div className="App"> */}
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                   
                    <Route path="/select-role" element={<SelectRolePage />} />
                   
                    <Route path="/student" element={<StudentDashboard />} />



                    <Route path="/teacher" element={<TeacherDashboard />} />
                    <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
                    <Route path="/teacher/login" element={<TeacherLogin />} />
                    <Route path="/teacher/class/:classId/subject/:subjectId" element={<ClassStudents />} />

                    <Route path="/hod" element={<HodDashboard />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin/register" element={<AdminRegister />} />
                    <Route path="/admin/add-student" element={<AddStudent />} /> 
                    <Route path="/admin/add-class" element={<AddClass />} />
                    <Route path="/admin/add-subject" element={<AddSubject />} />
                    <Route path="/admin/add-teacher" element={<AddTeacher />} /> 
                    <Route path="/admin/add-notice" element={<AddNotice />} /> 

                    <Route path="/admin/classes" element={<ViewClasses />} />
                    <Route path="/admin/students" element={<ViewStudents />} /> 
                    <Route path="/admin/teachers" element={<ViewTeachers />} /> 
                    <Route path="/admin/subjects" element={<ViewSubjects />} />


                    
                </Routes>
            {/* </div> */}
        </Router>
    </>
  )
}

export default App