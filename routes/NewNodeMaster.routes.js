import express from "express";
import { NewNodeMasterController } from "../controllers/index.js";
const router = express.Router();

router.post("AddUpdateNewNodeMaster", NewNodeMasterController.AddUpdateNewNodeMaster);

export default router;