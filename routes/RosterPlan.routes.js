import express from "express";
const router = express.Router();
import { RosterPlanController } from "../controllers/index.js";

router.post("/AddUpdateRosterPlan", RosterPlanController.AddUpdateRosterPlan);
router.post("/GetRosterPlan", RosterPlanController.GetRosterPlan);
router.post("/DeleteRosterPlan", RosterPlanController.DeleteRosterPlan);

export default router;