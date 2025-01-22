import express from "express";
import { ItemMasterController } from "../controllers/index.js";
const router = express.Router();

router.post("/AddUpdateItemMaster", ItemMasterController.AddUpdateItemMaster)

export default router;