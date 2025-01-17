import express from "express";
import { AuthController } from "../controllers/index.js";


const router = express.Router();


// UserPermissions Routes
router.post("/login", AuthController.login)
router.get("/GetUserPermission", AuthController.GetUserPermissions)
router.post("/AddUpdateUserPermissionMaster", AuthController.AddUpdateUserPermissionMaster)
router.post("/GetUserPermissionMaster", AuthController.GetUserPermissionMaster)
router.post("/GetUserPermissionList", AuthController.GetUserPermissionList)
router.delete("/DeleteUserPermissionMaster/:userId", AuthController.DeleteUserPermissionMaster)

// RoleMasters Routes

router.post("/AddUpdateRoleMaster", AuthController.AddUpdateRoleMaster)
router.get("/GetRoleMaster", AuthController.GetRoleMaster)
router.delete("/DeleteRoleMaster/:roleId", AuthController.DeleteRoleMaster)

// RolePermissionMasters Routes

router.post("/AddUpdateRolePermissionMaster", AuthController.AddUpdateRolePermissionMaster)
router.get("/GetRolePermissionMaster", AuthController.GetRolePermissionMaster)
// router.post("/Register", AuthController.Register)
router.get("/GetRolePermission", AuthController.GetRolePermission)


export default router;