import express from "express";
import { v2StateController } from "../../controllers/v2/index.js";

const router = express.Router();

router.get("/getStateByCountry", v2StateController.getState);

// router.post("/countryId", v2ContryController.getCountry);


export default router;