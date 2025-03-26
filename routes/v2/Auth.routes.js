import express from "express";
import { v2AuthController } from "../../controllers/v2/index.js";
const router = express.Router();


router.post("/signup", v2AuthController.signup);

export default router;