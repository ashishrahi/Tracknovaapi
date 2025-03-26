import express from "express";
import { v2CompanyManageController } from "../../controllers/v2/index.js";
const router = express.Router();

router.post("/register", v2CompanyManageController.register);

export default router;