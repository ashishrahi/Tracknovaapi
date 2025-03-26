import express from "express";
import authRoutes from "./Auth.routes.js"
import companyRoutes from "./Company.routes.js"
// import companyRoutes from "./"

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/company", companyRoutes);

export default router;