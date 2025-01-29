import express from "express";
const router = express.Router();
import { StateController } from "../controllers/index.js";

router.post("/AddUpdateState", StateController.AddUpdateState);
router.post("/GetState", StateController.GetState);
router.delete("/DeleteState", StateController.DeleteState);

export default router;