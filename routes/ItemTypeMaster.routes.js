import express from "express";
import { ItemTypeMasterController } from "../controllers/index.js";

const router = express.Router();

router.use("/AddUpdateItemTypeMaster", ItemTypeMasterController.AddUpdateItemTypeMaster)
router.use("/GetItemTypeMaster", ItemTypeMasterController.GetItemTypeMaster)

export default router;