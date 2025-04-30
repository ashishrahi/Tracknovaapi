import express from "express";
const router = express.Router();
import { GeoFencingController } from "../controllers/index.js";

// GeoFencing Routes
router.post("/AddUpdateGeoFencing", GeoFencingController.AddUpdateGeoFencing);

router.post("/GetGeoFencing", GeoFencingController.GetGeoFencing);

router.delete("/DeleteGeoFencing", GeoFencingController.DeleteGeoFencing);

export default router;
