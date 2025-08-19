import express from 'express';
import {
  teacherRegister,
  teacherLogIn,
  getTeachers,
  getTeacherDetail,
  updateTeacherTeaches,
  deleteTeacher,
} from '../controllers/teacher.controller.js';
import VerifyAdmin from '../middleware/VerifyAdmin.js';

const router = express.Router();

router.route('/register').post(VerifyAdmin , teacherRegister);                 // POST - Register teacher
router.route('/login').post(teacherLogIn);                       // POST - Login teacher
router.route('/admin/:adminId').get(getTeachers);              // GET - All teachers by school
// to this (adding the .put method):
router.route('/:teacherId').get(getTeacherDetail).put(VerifyAdmin, updateTeacher).delete(VerifyAdmin, deleteTeacher);
router.route('/update/teaches').put(updateTeacherTeaches);           // PUT - Update class for a teacher

const TeacherRouter = router
export default TeacherRouter;