import { StatusCodes } from "http-status-codes";
import { FuelCorrection } from "../../modals/index.js"
/////////////////////////////////////////// AddUpdateFuelCorrectionQuery //////////////////////////////////////////////////////////////////
export const AddUpdateFuelCorrectionQuery = async (model) => {
  
}

/////////////////////////////////////////// GetVehListQuery //////////////////////////////////////////////////////////////////
export const GetVehListQuery = async (model) => {
  
  const filter = req.body;  // Assuming data is sent in the body

  let resp = { ...CommonResponse };
  try {
      let { condition1, date1, date2, list1, listInt1, flag } = filter;
      
      let d1, d2;

      // Setting default date range
      if (condition1) {
          d1 = new Date("2020-01-01");
          d2 = new Date();  // Current date
      } else {
          d1 = new Date(date1);
          d2 = new Date(date2);
      }

      // Processing Vehicle Numbers (list1)
      let vehicles = [];
      if (!flag) {
          vehicles = list1.filter(veh => veh.trim() !== "").map(veh => ({ vehId: veh.trim() }));
      }

      // Processing Vehicle Types (listInt1)
      let vehicleTypes = [];
      if (!flag) {
          vehicleTypes = listInt1.map(id => ({ typeId: id }));
      }

      // Fetch data from MongoDB
      let vehiclesList = await Vehicle.aggregate([
          {
              $match: {
                  trackDate: { $gte: d1, $lte: d2 },
                  vehicleId: { $in: vehicles.map(v => v.vehId) },
                  vehicleTypeId: { $in: vehicleTypes.map(vt => vt.typeId) },
              },
          },
          {
              $sort: { trackDate: -1 },
          },
          {
              $group: {
                  _id: "$devId",
                  latestRecord: { $first: "$$ROOT" }
              }
          },
          {
              $replaceRoot: { newRoot: "$latestRecord" }
          }
      ]);

      // Data processing
      let processedData = vehiclesList.map(v => {
          v.openingBal = v.openingBal || "0.0";
          v.openingBalD = parseFloat(v.openingBal);
          v.opBalanceExist = v.openingBalD;
          return v;
      });

    return{
      isSuccess:structuredClone,
      status: true,
      data: processedData,
    }

  } catch (err) {
      return{
        status: false,
        message: err.message,
      }
  }
}

