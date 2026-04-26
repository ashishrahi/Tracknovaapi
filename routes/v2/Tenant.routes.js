import express from "express";
import { getTenantBranding, patchTenantBranding } from "../../controllers/v2/tenant.controller.js";

const router = express.Router();

router.get("/branding", getTenantBranding);
router.patch("/branding", patchTenantBranding);

export default router;
