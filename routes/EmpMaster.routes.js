import express from "express";
import { EmpMasterController } from "../controllers/index.js";

const router = express.Router();

// BinManage Routes
router.post("/AddUpdateEmployee", EmpMasterController.AddUpdateEmployee);
router.post("/ImportEmployee", EmpMasterController.ImportEmployee);
router.post("/Empstatus", EmpMasterController.Empstatus);
router.post("/GetEmployee", EmpMasterController.GetEmployee);
router.post("/DeleteEmployee", EmpMasterController.DeleteEmployee);
router.post("/UpsertEmpPermission", EmpMasterController.UpsertEmpPermission);

export default router;
