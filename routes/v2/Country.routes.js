import express from "express";
import { v2ContryController } from "../../controllers/v2/index.js";

const router = express.Router();

router.post("/getCountry", v2ContryController.getCountry);
// router.post("/countryId", v2ContryController.getCountry);


export default router;