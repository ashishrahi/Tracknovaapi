import express from "express";
import { v2AuthController } from "../../controllers/v2/index.js";
import { getLoggedInCompany } from "../../middlewares/index.js";
import { switchDatabase } from "../../middlewares/index.js"

const router = express.Router();


router.post("/signin",  v2AuthController.signin);
router.post("/logout", v2AuthController.logout);
router.post("/refresh", v2AuthController.refresh);

export default router;