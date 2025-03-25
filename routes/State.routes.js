import express from "express";
const router = express.Router();
import { StateController } from "../controllers/index.js";

router.post("/AddUpdateStateMaster", StateController.AddUpdateState);
router.post("/GetStateMaster", StateController.GetState);
router.delete("/DeleteState", StateController.DeleteState);

// For SAAS Create Company Page
router.get("/Countries/:CountryId/States", StateController.GetStatesByCountry);

export default router;