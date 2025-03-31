import express from "express";
import { v2AuthController } from "../../controllers/v2/index.js";
import { getLoggedInCompany } from "../../middlewares/index.js";
import { switchDatabase } from "../../middlewares/index.js"

const router = express.Router();

// for inserting loggedInCompany in req body;
router.post("/signin",  v2AuthController.signin);

export default router;