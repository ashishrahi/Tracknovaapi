import express from "express";
import { EmpMasterController } from "../controllers/index.js";

const router = express.Router();

// BinManage Routes
router.post("/AddUpdateEmployee", EmpMasterController.AddUpdateEmployee);
router.post("/GetEmployee", EmpMasterController.GetEmployee);
router.post("/UpsertEmpPermission", EmpMasterController.UpsertEmpPermission);
router.post("/DeleteEmployee", EmpMasterController.DeleteEmployee);

export default router;
