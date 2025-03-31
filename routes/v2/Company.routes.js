import express from "express";
import { v2CompanyManageController } from "../../controllers/v2/index.js";
import { switchDatabase } from "../../middlewares/index.js"
const router = express.Router();

router.post("/register", v2CompanyManageController.register);
router.get("/", v2CompanyManageController.find);
// router.get("/", (req, res) => {
//     console.log("✅ GET /companies route hit");
//     res.json({ message: "Route is working" });
// });
router.get("/switchCompany", switchDatabase, v2CompanyManageController.switchCompanyDatabase);
router.post("/switchCompany", v2CompanyManageController.switchCompanyDatabaseWithDbName);

export default router;