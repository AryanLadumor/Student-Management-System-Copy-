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

import ViewClasses from './Pages/Admin/ViewClasses';
import ViewStudents from './Pages/Admin/ViewStudents';
import ViewTeachers from './Pages/Admin/ViewTeachers'; 
import ViewSubjects from './Pages/Admin/ViewSubjects'; 
import Logout from './Pages/Admin/Logout';

import TeacherLogin from "./Pages/Teacher/TeacherLogin"; 
import ClassStudents from './Pages/Teacher/ClassStudents';
import TeacherProfile from './Pages/Teacher/TeacherProfile';
import MyClasses from './Pages/Teacher/MyClasses';
import StudentProfile from './Pages/Student/StudentProfile';
import StudentLogin from './Pages/Student/StudentLogin';
import StudentLogout from './Pages/Student/Logout';
import CreateComplain from './Pages/Student/CreateComplain';
import ViewComplaints from './Pages/Admin/ViewComplaints';
import StudentViewComplaints from './Pages/Student/ViewComplaints';
import StudentSubjects from './Pages/Student/StudentSubjects';
import StudentExamResults from './Pages/Student/StudentExamResults';
import NoticeBoard from './Pages/NoticeBoard';
import ViewStudentMarks from './Pages/ViewStudentMarks';

function App() {
  return (
    <>
      <Router>
            {/* <div className="App"> */}
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/select-role" element={<SelectRolePage />} />
                   
                   
                    <Route path="/student" element={<StudentDashboard />} />
                    <Route path="/student/profile" element={<StudentProfile />} />
                    <Route path="/student/login" element={<StudentLogin />} />
                    <Route path="/student/logout" element={<StudentLogout />} />
                    <Route path="/student/complain" element={<CreateComplain />} />
                    <Route path="/student/my-complaints" element={<StudentViewComplaints />} />
                    <Route path="/student/subjects" element={<StudentSubjects />} />
                    <Route path="/student/results" element={<StudentExamResults />} />
                    <Route path="/student/notices" element={<NoticeBoard />} />

                    <Route path="/teacher" element={<TeacherDashboard />} />
                    <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
                    <Route path="/teacher/login" element={<TeacherLogin />} />
                    <Route path="/teacher/class/:classId/subject/:subjectId" element={<ClassStudents />} />
                    <Route path="/teacher/profile" element={<TeacherProfile />} />
                    <Route path="/teacher/classes" element={<MyClasses />} />
                    <Route path="/teacher/notices" element={<NoticeBoard />} />
                    <Route path="/teacher/students/marks" element={<ViewStudentMarks />} />

                    

                    <Route path="/hod" element={<HodDashboard />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin/register" element={<AdminRegister />} />
                   
                    <Route path="/admin/classes" element={<ViewClasses />} />
                    <Route path="/admin/students" element={<ViewStudents />} /> 
                      <Route path="/admin/students/marks" element={<ViewStudentMarks />} />
                    <Route path="/admin/teachers" element={<ViewTeachers />} /> 
                    <Route path="/admin/subjects" element={<ViewSubjects />} />
                    <Route path="/admin/complaints" element={<ViewComplaints />} />
                    <Route path="/admin/notices" element={<NoticeBoard />} />
                    <Route path="/logout" element={<Logout />} />


                    
                </Routes>
            {/* </div> */}
        </Router>
    </>
  )
}

export default App