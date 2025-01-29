import express from "express";
import { DepartmentController } from "../controllers/index.js";

const router = express.Router();

// BinManage Routes
router.post(
  "/AddUpdateDepartmentMaster",
  DepartmentController.AddUpdateDepartmentMaster
);
router.post("/GetDepartmentMaster", DepartmentController.GetDepartmentMaster);
router.delete(
  "/DeleteDepartmentMaster",
  DepartmentController.DeleteDepartmentMaster
);

export default router;
