import express from "express";
import { ItemMasterController } from "../controllers/index.js";
const router = express.Router();

router.post("/AddUpdateItemMaster", ItemMasterController.AddUpdateItemMaster)
router.post("/GetItemMaster", ItemMasterController.GetItemMaster)
router.post("/DeleteItemMaster", ItemMasterController.DeleteItemMaster)

export default router;