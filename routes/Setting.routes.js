import express from "express";
const router = express.Router();
import { SettingController } from "../controllers/index.js";

router.post("/AddUpdateSetting", SettingController.AddUpdateSetting);
router.post("/GetSetting", SettingController.GetSetting);
router.delete("/DeleteSetting", SettingController.DeleteSetting);
s
export default router;