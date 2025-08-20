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

// --- THIS IS THE CORRECTED CODE ---

// POST /class -> Create a new class
router.route("/").post(verifyAdmin, createClass);

// GET /class/:id -> List all classes for a specific admin
router.route("/:id").get(listClasses);

// GET, PUT, DELETE /class/detail/:id -> Get, update, or delete a single class by its own ID
router.route("/detail/:id")
  .get(getClassDetail)
  .put(verifyAdmin, updateClass)
  .delete(verifyAdmin, deleteClass);

const ClassRouter = router;
export default ClassRouter;