import express from "express";
import { CommController } from "../controllers/index.js";
const router = express.Router();

router.post("/GetCommGroup", CommController.GetCommGroup)
router.post("/UpsertCommGroup", CommController.UpsertCommGroup)
router.post("/DeleteCommGroup", CommController.DeleteCommGroup)
router.get("/GetCommGroupByEmpId", CommController.GetCommGroupByEmpId)
router.post("/GetAllEmailSetting", CommController.GetAllEmailSetting)
router.post("/UpsertEmailSetting", CommController.UpsertEmailSetting)
router.post("/GetAllSmsSetting", CommController.GetAllSmsSetting)
router.get("/GetAllSmsSetting", CommController.GetCampaignDetailById)


export default router;