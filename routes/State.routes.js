import express from "express";
const router = express.Router();
import { StateController } from "../controllers/index.js";

router.post("/AddUpdateStateMaster", StateController.AddUpdateState);
router.post("/ImportStates", StateController.ImportStates);

router.post("/GetStateMaster", StateController.GetState);
router.post("/States/:CountryId", StateController.GetStatebyCountry);
router.delete("/DeleteState", StateController.DeleteState);

// For SAAS Create Company Page

export default router;