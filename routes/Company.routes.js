import express from "express";
import { CompanyController } from "../controllers/index.js";

const router = express.Router();

router.get("/", CompanyController.getAllCompanies);


export default router;