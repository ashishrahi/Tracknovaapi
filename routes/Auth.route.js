import express from "express";
import { AuthController } from "../controllers/index.js";


const router = express.Router();

router.post("/login", AuthController.login)
router.get("/GetUserPermission", AuthController.GetUserPermissions)
router.post("/AddUpdateUserPermissionMaster", AuthController.AddUpdateUserPermissionMaster)
router.post("/GetUserPermissionMaster", AuthController.GetUserPermissionMaster)










export default router;