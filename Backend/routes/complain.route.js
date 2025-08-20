// routes/complain.routes.js
import express from 'express';
import {
  createComplain,
  getComplainsForAdmin,
  updateComplainStatus,
  deleteComplain,
  getComplainsByStudent,
} from '../controllers/complain.controller.js';
import VerifyAdmin from '../middleware/VerifyAdmin.js';

const router = express.Router();

router
  .route('/create')
  .post(createComplain);

router
  .route('/admin/:adminId')
  .get(getComplainsForAdmin);
  
router
  .route('/student/:studentId')
  .get(getComplainsByStudent);

router
  .route('/:complainId')
  .delete(VerifyAdmin, deleteComplain);

router
  .route('/:complainId/status')
  .patch(VerifyAdmin, updateComplainStatus);

const ComplainRouter = router
export default ComplainRouter;