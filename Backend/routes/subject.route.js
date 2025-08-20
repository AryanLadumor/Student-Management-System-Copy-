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

router.route('/createsub').post(VerifyAdmin,createSubject);

router.route('/admin/:adminId').get(VerifyAdmin,allSubjects).delete(VerifyAdmin,deleteSubjects);

router.route('/class/:classId').get(classSubjects).delete(VerifyAdmin,deleteSubjectsByClass);

// --- UPDATE STARTS HERE ---
// The verifyAdmin middleware has been removed from the GET route
// to allow teachers to fetch subject details.
router.route('/:subjectId').get(getSubjectDetail).put(VerifyAdmin,updateSubject).delete(VerifyAdmin,deleteSubject);
// --- UPDATE ENDS HERE ---

const SubjectRouter = router
export default SubjectRouter;