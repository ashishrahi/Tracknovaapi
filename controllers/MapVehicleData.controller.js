import { StatusCodes } from "http-status-codes";
import {
  ApiErrorResponse,
  CommonResponse,
  ApiSuccessResponse,
} from "../utils/apiResponse/index.js";
import {
  GetMapVehicleDataQuery,
} from "../utils/DBQueries/MapVehicleData.Query.js";



export async function GetMapVehicleData(req, res) {
    try {
        const { status, message, data,RowCount } = await GetMapVehicleDataQuery();
        const successResponse = new CommonResponse(status, message, data,);
        res.status(StatusCodes.OK).json(successResponse);
    } catch (error) {
        const apiErrorResponse = new ApiErrorResponse( 
          StatusCodes.BAD_REQUEST, 
          error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(apiErrorResponse);
    }
 }

