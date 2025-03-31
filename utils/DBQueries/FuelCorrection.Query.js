import { StatusCodes } from "http-status-codes";
import { FuelCorrection } from "../../modals/index.js";
import { VehicleTrack } from "../../controllers/VehicleMoving.controller.js";
import { VehicleMovingStatusdetnew } from "./VehicleMovingControllerPipeline.js";
import { VehicleMovingControllerPipeline } from "./index.js";
import formattedData from "../dotnet-like-format/dotnetLikeData.js";

/////////////////////////////////////////// AddUpdateFuelCorrectionQuery //////////////////////////////////////////////////////////////////
export const AddUpdateFuelCorrectionQuery = async (model) => {};

/////////////////////////////////////////// GetVehListQuery //////////////////////////////////////////////////////////////////
export const GetVehListQuery = async (model) => {
  try {
    const filter = model; // Assuming data is sent in the body

    //   let resp = { ...CommonResponse };
    // let { condition1, date1, date2, list1, listInt1, flag } = filter;

    // let d1, d2;

    // // Setting default date range
    // if (condition1) {
    //     d1 = new Date("2020-01-01");
    //     d2 = new Date();  // Current date
    // } else {
    //     d1 = new Date(date1);
    //     d2 = new Date(date2);
    // }

    // // Processing Vehicle Numbers (list1)
    // let vehicles = [];
    // if (!flag) {
    //     vehicles = list1.filter(veh => veh.trim() !== "").map(veh => ({ vehId: veh.trim() }));
    // }

    // // Processing Vehicle Types (listInt1)
    // let vehicleTypes = [];
    // if (!flag) {
    //     vehicleTypes = listInt1.map(id => ({ typeId: id }));
    // }

    // Fetch data from MongoDB
    let vehiclesList =
      await VehicleMovingControllerPipeline.VehicleMovingStatusdetnew(filter);

    // Data processing
    let processedData =
      vehiclesList &&
      vehiclesList.Data.map((v) => {
        v.openingBal = v.openingBal || "0.0";
        v.openingBalD = parseFloat(v.openingBal);
        v.opBalanceExist = v.openingBalD;
        return v;
      });

    return {
      //   isSuccess:structuredClone,
      status: true,
      message: "data Fetch successfully",
      data: formattedData(processedData),
    };
  } catch (err) {
    return {
      status: false,
      message: err.message,
    };
  }
};
