import express from "express";
import { NewNodeMasterController } from "../controllers/index.js";
const router = express.Router();

router.post("/AddUpdateNode", NewNodeMasterController.AddUpdateNewNodeMaster);
router.get("/GetAllNodes", NewNodeMasterController.GetAllNodes);
router.post("/DeleteNode", NewNodeMasterController.DeleteNode);



export default router;