import express from "express";
import { VendorMasterController } from "../controllers/index.js";


const router = express.Router();

router.post("/AddUpdateVendorMaster", VendorMasterController.AddUpdateVendorMaster);

export default router;