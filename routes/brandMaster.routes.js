import express from "express";
import { BrandController } from "../controllers/index.js";

const router = express.Router();

// BrandMaster Routes

router.post("/AddUpdateBrandMaster", BrandController.AddUpdateBrandMaster);
router.post("/ImportBrands", BrandController.ImportBrands);
router.post("/GetBrand", BrandController.GetBrand);
router.delete("/DeleteBrand", BrandController.DeleteBrand);

export default router;
