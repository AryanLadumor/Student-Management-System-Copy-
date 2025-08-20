import express from "express";
import {
  createClass,
  listClasses,
  getClassDetail,
  updateClass,
  deleteClass,
} from "../controllers/class.controller.js";
import verifyAdmin from "../middleware/VerifyAdmin.js";

const router = express.Router();

router.route("/").post(verifyAdmin, createClass);

router.route("/:id").get(listClasses);

// --- UPDATE STARTS HERE ---
// The verifyAdmin middleware has been removed from the GET route
// to allow teachers to fetch class details.
router.route("/detail/:id")
  .get(getClassDetail)
  .put(verifyAdmin, updateClass)
  .delete(verifyAdmin, deleteClass);
// --- UPDATE ENDS HERE ---

const ClassRouter = router;
export default ClassRouter;