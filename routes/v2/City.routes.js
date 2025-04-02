import express from "express";
import { v2CityController } from "../../controllers/v2/index.js";

const router = express.Router();

router.get("/getCityByState", v2CityController.getCity);



export default router;