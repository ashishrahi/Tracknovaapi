import express from "express";
import {BinManageController} from "../controllers/index.js";


const router = express.Router();


// BinManage Routes
router.post("/AddUpdateBinManage", BinManageController.AddUpdateBinManage)
router.post("/GetBinManage", BinManageController.GetBinManage)




export default router;