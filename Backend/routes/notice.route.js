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
  .post(VerifyAdmin, createNotice); // POST /notices

router
  .route("/admin/:adminId")
  .get(getNoticesByAdmin)           // GET all notices by admin
  .delete(VerifyAdmin, deleteAllNoticesByAdmin); // DELETE all notices by admin

router
  .route("/:noticeId")
  .put(VerifyAdmin, updateNotice)   // PUT /notices/:noticeId
  .delete(VerifyAdmin, deleteNotice); // DELETE /notices/:noticeId


const NoticeRouter = router
export default NoticeRouter;