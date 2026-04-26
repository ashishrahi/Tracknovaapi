import express from "express";
import { v2AuthController } from "../../controllers/v2/index.js";
const router = express.Router();


router.post("/signin",  v2AuthController.signin);
router.post("/tenant-login", v2AuthController.tenantLogin);
router.post("/logout", v2AuthController.logout);
router.post("/refresh", v2AuthController.refresh);
router.post("/forgot-password", v2AuthController.forgotPassword)
router.post("/reset-password", v2AuthController.resetPassword)


export default router;