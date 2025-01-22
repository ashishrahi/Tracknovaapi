import express from "express";
import { ItemCategoryController } from "../controllers/index.js";

const router = express.Router();

router.post("/AddUpdateItemCategory", ItemCategoryController.AddUpdateItemCategory)
router.post("/GetItemCategory", ItemCategoryController.GetItemCategory)
router.post("/DeleteItemCategory", ItemCategoryController.DeleteItemCategory)

export default router;