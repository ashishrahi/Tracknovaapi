import express from "express";
const router = express.Router();
import { VtypeinfoController } from "../controllers/index.js";

router.post("/AddUpdateVtypeinfo", VtypeinfoController.AddUpdateVtypeinfo);
router.post("/getVtypeinfo", VtypeinfoController.getVtypeinfo);
router.delete("/DeleteVtypeinfo", VtypeinfoController.DeleteVtypeinfo);

export default router;