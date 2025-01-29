import express from "express";
import { AreaMasterController } from "../controllers/index.js";

const router = express.Router();

// BinLocation Routes

router.post("/AddUpdateAreaWardMaster",AreaMasterController.AddUpdateAreaWardMaster);
router.post("/GetAreaWardMaster", AreaMasterController.GetAreaWardMaster);
router.post("/DeleteAreaWardMaster", AreaMasterController.DeleteAreaWardMaster);

export default router;