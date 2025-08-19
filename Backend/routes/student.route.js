import express from "express";
import {
  registerStudent,
  loginStudent,
  getAllStudents,
  getStudentById,
  markAttendance,
  addExamResult,
} from "../controllers/student.controller.js";
import verifyAdmin from "../middleware/VerifyAdmin.js";


const router = express.Router();

//Autheticate Students
router.route("/register").post(registerStudent);
router.route("/login").post( loginStudent);


//Get Specific Student By Id
router.route("/:id").get( getStudentById);
//Get Students By Inistitue
router.route("/institute/:id/").get( getAllStudents);

// Attendance and Exam Results
router.route("/:studentId/attendance").post(verifyAdmin, markAttendance);
router.route("/:studentId/results").post(verifyAdmin, addExamResult);


const StudentRouter = router;
export default StudentRouter;