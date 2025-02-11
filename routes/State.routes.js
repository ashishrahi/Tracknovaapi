import express from "express";
const router = express.Router();
import { StateController } from "../controllers/index.js";

router.post("/AddUpdateStateMaster", StateController.AddUpdateState);
router.post("/GetStateMaster", StateController.GetState);
router.delete("/DeleteState", StateController.DeleteState);

export default router;