import express from "express";
import authRoutes from "./Auth.routes.js"
import companyRoutes from "./Company.routes.js"
import countryRoutes from "./Country.routes.js"
import stateRoutes from "./State.routes.js"


const router = express.Router();

router.use("/auth", authRoutes);
router.use("/company", companyRoutes);
router.use("/country", countryRoutes)
router.use("/state", stateRoutes)

export default router;