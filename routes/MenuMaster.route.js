import express from "express";
const router = express.Router();
import { MenuMasterController } from "../controllers/index.js";

router.post("/AddUpdateMenuMaster", MenuMasterController.AddUpdateMenuMaster);
router.post("/GetMenuMaster", MenuMasterController.GetMenuMaster);
router.post("/GetParentMenuMaster", MenuMasterController.GetParentMenuMaster);
router.post("/GetChildMenuMaster", MenuMasterController.GetChildMenuMaster);
router.delete("/DeleteMenuMaster", MenuMasterController.DeleteMenuMaster);

export default router;