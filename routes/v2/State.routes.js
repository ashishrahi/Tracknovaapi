import express from "express";
import { v2StateController } from "../../controllers/v2/index.js";

const router = express.Router();

// add State
router.post("/addState", v2StateController.addState);

// getStateByCountry
router.get("/getStateByCountry", v2StateController.getState);

// stateList
router.get("/stateList", v2StateController.stateList);

// deleteList
router.get("/deleteState", v2StateController.deleteState);



export default router;