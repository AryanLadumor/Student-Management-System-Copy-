import express from "express";
import {
  registerStudent,
  loginStudent,
  getAllStudents,
  getStudentById,
  markAttendance,
  addExamResult,
  deleteStudent,
  updateStudent,
  getStudentsByClass
} from "../controllers/student.controller.js";
import verifyAdmin from "../middleware/VerifyAdmin.js";


const router = express.Router();

//Autheticate Students
router.route("/register").post(registerStudent);
router.route("/login").post( loginStudent);

router.route("/class/:classId").get(getStudentsByClass);

//Get Specific Student By Id
router.route("/:id").get( getStudentById).put(verifyAdmin, updateStudent);;
//Get Students By Inistitue
router.route("/institute/:id/").get(verifyAdmin , getAllStudents).delete(verifyAdmin, deleteStudent);;

// Attendance and Exam Results
router.route("/:studentId/attendance").post(verifyAdmin, markAttendance);
router.route("/:studentId/results").post(verifyAdmin, addExamResult);


const StudentRouter = router;
export default StudentRouter;