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
//---> Getting, updating, and deleting a specific Admin By Id
router.route("/:id")
  .get(verifyAdmin, adminDetails)
  .put(verifyAdmin, updateAdmin)
  .delete(verifyAdmin, deleteAdmin);

//=========== Autheticate Students
router.route("/register").post(adminRegister);
router.route("/login").post(adminLogin);


const AdminRouter = router;
export default AdminRouter;