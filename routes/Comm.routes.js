import express from "express";
import { CommController } from "../controllers/index.js";
const router = express.Router();

router.post("/GetCommGroup", CommController.GetCommGroup)
router.post("/UpsertCommGroup", CommController.UpsertCommGroup)


export default router;