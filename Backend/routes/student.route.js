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
  getStudentsByClass,
  getExamResults,
  getStudentsWithResults,
  updateStudentMarks,
  updateSubjectMarksForStudent
} from "../controllers/student.controller.js";
import verifyAdmin from "../middleware/VerifyAdmin.js";


const router = express.Router();

//Autheticate Students
router.route("/register").post(registerStudent);
router.route("/login").post( loginStudent);

// --- UPDATE STARTS HERE ---
// This route is now accessible to teachers as well.
router.route("/class/:classId").get(getStudentsByClass);
// --- UPDATE ENDS HERE ---

//Get Specific Student By Id
router.route("/:id").get( getStudentById).put(verifyAdmin, updateStudent);;
//Get Students By Inistitue
router.route("/institute/:id/").get(verifyAdmin , getAllStudents).delete(verifyAdmin, deleteStudent);;

// Attendance and Exam Results
router.route("/:studentId/attendance").post(verifyAdmin, markAttendance);
router.route("/:studentId/results")
    .get(getExamResults)
    .put(updateStudentMarks) // This allows updating marks
    .post(verifyAdmin, addExamResult);

router.route("/admin/:adminId/results").get(getStudentsWithResults);
router.route("/:studentId/subjects/:subjectId/marks").put(updateSubjectMarksForStudent);


const StudentRouter = router;
export default StudentRouter;