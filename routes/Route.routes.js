import express from "express";
const router = express.Router();
import { RoutesController } from "../controllers/index.js";

router.post("/AddUpdateRoutes", RoutesController.AddUpdateRoutes);
router.post("/GetRoutes", RoutesController.GetRoutes);
router.delete("/DeleteRoutes", RoutesController.DeleteRoutes);

export default router;