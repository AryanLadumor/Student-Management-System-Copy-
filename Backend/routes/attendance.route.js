import express from 'express';
import { 
    markAttendance, 
    getAttendance, 
    getAdminAttendance, 
    getTeacherAttendance 
} from '../controllers/attendance.controller.js';
// Middlewares for verification can be added here later
// import verifyAdmin from '../middleware/VerifyAdmin.js';
// import verifyTeacher from '../middleware/VerifyTeacher.js';

const router = express.Router();

router.route('/mark').post(markAttendance); // For teachers to mark attendance
router.route('/student/:studentId').get(getAttendance); // For a student's own view
router.route('/admin/:adminId').get(getAdminAttendance); // For the admin's view
router.route('/teacher/:teacherId').get(getTeacherAttendance); // For the teacher's view


const AttendanceRouter = router;
export default AttendanceRouter;
