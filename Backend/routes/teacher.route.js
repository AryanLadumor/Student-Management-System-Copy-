import express from 'express';
import {
  teacherRegister,
  teacherLogIn,
  getTeachers,
  getTeacherDetail,
  updateTeacherTeaches,
  deleteTeacher,
  updateTeacher, // <-- Add this import
} from '../controllers/teacher.controller.js';
import VerifyAdmin from '../middleware/VerifyAdmin.js';

const router = express.Router();

router.route('/register').post(VerifyAdmin , teacherRegister);
router.route('/login').post(teacherLogIn);
router.route('/admin/:adminId').get(getTeachers);

// This line now has all its functions correctly imported
router.route('/:teacherId').get(getTeacherDetail).put(VerifyAdmin, updateTeacher).delete(VerifyAdmin, deleteTeacher);

router.route('/update/teaches').put(updateTeacherTeaches);

const TeacherRouter = router
export default TeacherRouter;