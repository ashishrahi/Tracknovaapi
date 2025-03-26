import express from "express";
import { v2AuthController } from "../../controllers/v2/index.js";
const router = express.Router();


router.post("/signin", v2AuthController.signin);

export default router;