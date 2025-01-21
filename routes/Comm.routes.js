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
router.post("/GetCampaign", CommController.GetCampaign)
router.post("/UpsertCampaign", CommController.UpsertCampaign)  // need to verify data
router.post("/DeleteCampaign", CommController.DeleteCampaign)
router.post("/GetCampaignTemplate", CommController.GetCampaignTemplate)
router.post("/UpsertCampaignTemplate", CommController.UpsertCampaignTemplate)
router.post("/DeleteCampaignTemplate", CommController.DeleteCampaignTemplate)
router.post("/GetEventSetting", CommController.GetEventSetting)
router.post("/UpsertEventSetting", CommController.UpsertEventSetting)
router.post("/DeleteEventSetting", CommController.DeleteEventSetting)


export default router;