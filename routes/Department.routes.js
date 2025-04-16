import express from "express";
import { DepartmentController } from "../controllers/index.js";

const router = express.Router();

// BinManage Routes
router.post(
  "/AddUpdateDepartmentmaster",
  DepartmentController.AddUpdateDepartmentMaster
);

router.post("/ImportDepartments", DepartmentController.ImportDepartments);

router.post("/GetDepartmentmaster", DepartmentController.GetDepartmentMaster);
router.delete(
  "/DeleteDepartmentmaster",
  DepartmentController.DeleteDepartmentMaster
);

export default router;
