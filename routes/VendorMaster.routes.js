import express from "express";
import { VendorMasterController } from "../controllers/index.js";


const router = express.Router();

router.post("/AddUpdateVendorMaster", VendorMasterController.AddUpdateVendorMaster);
router.post("/Ge3tVendorMaster", VendorMasterController.GetVendorMaster);
router.delete("/DeleteVendorMaster", VendorMasterController.DeleteVendorMaster);

export default router;