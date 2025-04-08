import express from "express";
import { v2CityController } from "../../controllers/v2/index.js";

const router = express.Router();

// addCity
router.post("/addCity",v2CityController.addCity)

// cityList
router.get("/cityList",v2CityController.cityList)

// getCityByState
router.get("/getCityByState", v2CityController.getCity);

// deleteList
router.post("/deleteCity",v2CityController.deleteCity)



export default router;