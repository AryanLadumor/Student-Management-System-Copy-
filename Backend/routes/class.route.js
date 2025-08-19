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

// POST /sclass - Create new class
router.post("/", verifyAdmin, createClass);

// GET /sclass/:id - List classes by admin ID
router.get("/:id", listClasses);

// GET /sclass/detail/:id - Get single class detail by class ID
router.get("/detail/:id", getClassDetail).put(verifyAdmin, updateClass).delete(verifyAdmin, deleteClass);

const ClassRouter = router;
export default ClassRouter;