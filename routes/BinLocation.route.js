import express from "express";
import { BinLocationController } from "../controllers/index.js";

const router = express.Router();

// BinLocation Routes

router.post(
  "/AddUpdateBinLocation",
  BinLocationController.AddUpdateBinLocation
);
router.post("/GetBinLocation", BinLocationController.GetBinLocation);
router.post("/DeleteBinLocation", BinLocationController.DeleteBinLocation);

export default router;
