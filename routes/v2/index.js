import express from "express";
import authRoutes from "./Auth.routes.js"
import companyRoutes from "./Company.routes.js"
import countryRoutes from "./Country.routes.js"
import stateRoutes from "./State.routes.js"
import cityRoutes from './City.routes.js'
import saasRoutes from "./Saas.routes.js";
import publicRoutes from "./Public.routes.js";
import tenantRoutes from "./Tenant.routes.js";


const router = express.Router();

router.use("/auth", authRoutes);
router.use("/public", publicRoutes);
router.use("/tenant", tenantRoutes);
router.use("/company", companyRoutes);
router.use("/country", countryRoutes)
router.use("/state", stateRoutes)
router.use("/city", cityRoutes)
router.use("/saas", saasRoutes);


export default router;