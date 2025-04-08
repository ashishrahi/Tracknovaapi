import express from "express";
import { v2ContryController } from "../../controllers/v2/index.js";

const router = express.Router();

router.post("/addCountry", v2ContryController.addCountry)
router.post("/getCountry", v2ContryController.getCountry);
router.post("/deleteCountry", v2ContryController.deleteCountry);

// router.post("/countryId", v2ContryController.getCountry);


export default router;