import express from "express";
const router = express.Router();
import { TaxMasterController } from "../controllers/index.js";

router.post("/AddUpdateTaxMaster", TaxMasterController.AddUpdateTaxMaster);
router.post("/GetTaxMaster", TaxMasterController.GetTaxMaster);
router.delete("/DeleteTaxMaster", TaxMasterController.DeleteTaxMaster);

export default router;