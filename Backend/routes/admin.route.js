import express from "express";
import verifyAdmin from "../middleware/VerifyAdmin.js";
import {
  adminLogin,
  adminRegister,
  adminDetails,
  updateAdmin,
  deleteAdmin,
} from "../controllers/admin.controller.js";

const router = express.Router();

//=========== Autheticate Students
router.route("/register").post(adminRegister);
router.route("/login").post(adminLogin);

//---> Getting, updating, and deleting a specific Admin By Id
router.route("/:id")
  .get(verifyAdmin, adminDetails) // <-- This was changed from .post() to .get()
  .put(verifyAdmin, updateAdmin)
  .delete(verifyAdmin, deleteAdmin);

const AdminRouter = router;
export default AdminRouter;