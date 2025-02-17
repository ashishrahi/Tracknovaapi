
import {VehicleFuelDateRangePipeline} from '../utils/DBQueries/index.js'
import { StatusCodes } from 'http-status-codes';
import formattedData from '../utils/dotnet-like-format/dotnetLikeData.js';


async function VehicleFuelDateRange(req, res, next) {
  try {
    const filter = req.body;
    const fuelComsumed =
      await VehicleFuelDateRangePipeline.VehicleFuelDateRange(filter);
    const data = formattedData(fuelComsumed?.Data);


    try {

  const filter = req.body;
  const fuelComsumed = await VehicleFuelDateRangePipeline.VehicleFuelDateRange(filter)
  const data = formattedData(fuelComsumed?.data)
  
  if (filter.Show) {
    return res.status(StatusCodes.OK).json(data)
  }
  return res.status(StatusCodes.OK).json(data)
    } catch (error) {
      error.StatusCode = StatusCodes.BAD_REQUEST
      error.ErrorMessage = error.message
      return next(error)

    }
    return res.status(StatusCodes.OK).json(data);
  } catch (error) {
    error.StatusCode = StatusCodes.BAD_REQUEST;
    error.ErrorMessage = error.message;
    return next(error);
  }
}

export { VehicleFuelDateRange };
