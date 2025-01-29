import express from "express";
const router = express.Router();
import { TraccarController } from "../controllers/index.js";

router.post("/location", TraccarController.AddUpdatelocation);
router.post("/locationClient", TraccarController.GetlocationClient);

export default router;