import { FuelCorrection } from "../../modals/index.js"
/////////////////////////////////////////// AddUpdateFuelCorrectionQuery //////////////////////////////////////////////////////////////////
export const AddUpdateFuelCorrectionQuery = async (model) => {}

/////////////////////////////////////////// GetVehListQuery //////////////////////////////////////////////////////////////////
export const GetVehListQuery = async (model) => {
  

  try {
    let startDate, endDate;

    if (model.Condition1) {
      startDate = new Date('2020-01-01');
      endDate = new Date();
    } else {
      startDate = new Date(model.date1);
      endDate = new Date(model.date2);
    }

    // Create vehicle data table equivalent
    const vehicleArray = model.Flag
      ? []
      : model.list1.filter(Boolean).map((veh, index) => ({ RowID: index + 1, RowValue: veh.trim() }));

    // Create vehicle type data table equivalent
    const vehicleTypeArray = model.Flag
      ? []
      : model.listInt1.map((id, index) => ({ RowID: index + 1, RowValue: id }));

    // Build the MongoDB aggregation query
    const aggregationPipeline = [
      {
        $match: {
          trackDate: { $gte: startDate, $lte: endDate },
          ...(model.Flag ? {} : { vehicleNo: { $in: vehicleArray.map((v) => v.RowValue) } }),
          ...(model.Flag ? {} : { vehicleType: { $in: vehicleTypeArray.map((v) => v.RowValue) } }),
        },
      },
      {
        $sort: { trackDate: -1 },
      },
    ];

    // Execute the aggregation query
    const vehicleData = await VehicleList.aggregate(aggregationPipeline);

    // Post-process the data
    const deviceIds = [...new Set(vehicleData.map((v) => v.Devid))];
    const processedData = deviceIds.map((id) => {
      const latestEntry = vehicleData.filter((v) => v.Devid === id).sort((a, b) => b.trackDate - a.trackDate)[0];

      if (latestEntry) {
        latestEntry.OpeningBal = latestEntry.OpeningBal || '0.0';
        latestEntry.OpeningBalD = parseFloat(latestEntry.OpeningBal);
        latestEntry.OpBalanceExist = latestEntry.OpeningBalD;
      }

      return latestEntry;
    }).filter(Boolean);

    response.status = 'Success';
    response.data = processedData;
  } catch (error) {
    response.status = 'Failed';
    response.message = error.message;
  }

  return response;
}

