import express from "express";
import { NTReadController } from "../controllers/index.js";

const router = express.Router();

router.get("/ProbWireTamp", NTReadController.probWireTamp );

export default router;