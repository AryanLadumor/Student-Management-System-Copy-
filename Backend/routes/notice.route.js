import express from "express"
import {
  createNotice,
  getNoticesByAdmin,
  updateNotice,
  deleteNotice,
  deleteAllNoticesByAdmin
} from "../controllers/notice.controller.js"
import VerifyAdmin from "../middleware/VerifyAdmin.js";

const router = express.Router();

router
  .route("/")
  .post(VerifyAdmin, createNotice);

// --- UPDATE STARTS HERE ---
// The VerifyAdmin middleware has been removed from the GET route
// to allow students and teachers to view notices.
router
  .route("/admin/:adminId")
  .get(getNoticesByAdmin)
  .delete(VerifyAdmin, deleteAllNoticesByAdmin);
// --- UPDATE ENDS HERE ---

router
  .route("/:noticeId")
  .put(VerifyAdmin, updateNotice)
  .delete(VerifyAdmin, deleteNotice);


const NoticeRouter = router
export default NoticeRouter;