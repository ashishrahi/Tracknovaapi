import { probWireTamp, getVehicleNotMoved } from "./NTRead.controller.js";
import { getVehicleDistance } from "./Dashboard.controller.js";




export const NTReadController = {
    probWireTamp: probWireTamp,
    getVehicleNotMoved: getVehicleNotMoved

}



export const DashboardController = {
    getVehicleDistance: getVehicleDistance,
}


