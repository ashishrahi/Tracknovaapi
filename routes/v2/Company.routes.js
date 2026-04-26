import express from "express";
import { v2CompanyManageController } from "../../controllers/v2/index.js";
import { switchDatabase } from "../../middlewares/index.js"
const router = express.Router();

router.post("/register", v2CompanyManageController.register);
router.post("/bulk", v2CompanyManageController.bulkAction);
router.get("/stats", v2CompanyManageController.listStats);
router.get("/switchCompany", switchDatabase, v2CompanyManageController.switchCompanyDatabase);
router.post("/switchCompany", v2CompanyManageController.switchCompanyDatabaseWithDbName);
router.get("/:id/audit-logs", v2CompanyManageController.getAuditLogs);
router.get("/:id/usage", v2CompanyManageController.getUsage);
router.get("/:id/tenant/users", v2CompanyManageController.getTenantUsers);
router.get("/:id/tenant/vehicles", v2CompanyManageController.getTenantVehicles);
router.patch("/:id", v2CompanyManageController.updateById);
router.get("/:id", v2CompanyManageController.getById);
router.get("/", v2CompanyManageController.find);
router.delete("/:id", v2CompanyManageController.remove);

export default router;
