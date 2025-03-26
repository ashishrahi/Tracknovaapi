import express from "express";
import { v2CompanyManageController } from "../../controllers/v2/index.js";
const router = express.Router();

router.post("/register", v2CompanyManageController.register);
router.get("/", v2CompanyManageController.find)

export default router;