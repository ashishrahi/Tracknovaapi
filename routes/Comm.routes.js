import express from "express";
import { CommController } from "../controllers/index.js";
const router = express.Router();

router.post("/GetCommGroup", CommController.GetCommGroup)
router.post("/UpsertCommGroup", CommController.UpsertCommGroup)
router.post("/DeleteCommGroup", CommController.DeleteCommGroup)
router.get("/GetCommGroupByEmpId", CommController.GetCommGroupByEmpId)
router.get("/GetAllEmailSetting", CommController.GetAllEmailSetting)
router.get("/UpsertEmailSetting", CommController.UpsertEmailSetting)


export default router;