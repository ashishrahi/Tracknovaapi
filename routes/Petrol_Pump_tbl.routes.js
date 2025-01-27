import express from "express";
const router = express.Router();
import { PetrolPumpController } from "../controllers/index.js";

router.post("/AddUpdatePetrolPump", PetrolPumpController.AddUpdatePetrolPump);
router.post("/GetPetrolPumpVehicle", PetrolPumpController.GetPetrolPumpVehicle);
router.post("/GetPetrolPump", PetrolPumpController.GetPetrolPump);
router.delete("/DeletePetrolPump", PetrolPumpController.DeletePetrolPump);

export default router;