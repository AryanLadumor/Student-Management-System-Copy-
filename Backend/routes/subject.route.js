import express from 'express';
import {
  createSubject,
  allSubjects,
  classSubjects,
  getSubjectDetail,
  updateSubject,
  deleteSubject,
  deleteSubjects,
  deleteSubjectsByClass,
} from '../controllers/subject.controller.js';
import VerifyAdmin from '../middleware/VerifyAdmin.js';

const router = express.Router();

router.route('/createsub').post(VerifyAdmin,createSubject); // POST - Create a subject

router.route('/admin/:adminId').get(VerifyAdmin,allSubjects).delete(VerifyAdmin,deleteSubjects); // GET - All subjects for an admin

router.route('/class/:classId').get(classSubjects).delete(VerifyAdmin,deleteSubjectsByClass); // GET - Subjects for a class

router.route('/:subjectId').get(getSubjectDetail).put(VerifyAdmin,updateSubject).delete(VerifyAdmin,deleteSubject); // GET - One subject by ID

const SubjectRouter = router
export default SubjectRouter;