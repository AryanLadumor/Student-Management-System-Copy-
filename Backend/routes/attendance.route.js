import express from 'express';
import { markAttendance, getAttendance } from '../controllers/attendance.controller.js';
// Assuming you have a middleware to verify the teacher's token
// import verifyTeacher from '../middleware/VerifyTeacher.js';

const router = express.Router();

// For now, we'll use a generic route, but you might want to add authentication middleware
router.route('/mark').post(markAttendance);
router.route('/:studentId').get(getAttendance);

const AttendanceRouter = router;
export default AttendanceRouter;