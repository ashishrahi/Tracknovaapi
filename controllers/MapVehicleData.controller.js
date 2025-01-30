import { StatusCodes } from "http-status-codes";
import {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../utils/apiResponse/index.js";
import {
  GetMapVehicleDataQuery,
} from "../utils/DBQueries/MapVehicleData.Query.js";

export async function GetMapVehicleData(req, res) {
    try {
        const { data, isSuccess, message, statusCode } = await GetMapVehicleDataQuery();
        const successResponse = new ApiSuccessResponse(isSuccess, statusCode, message, data);
        res.status(statusCode).json(successResponse);
    } catch (error) {
        const apiErrorResponse = new ApiErrorResponse( 
          StatusCodes.BAD_REQUEST, 
          error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(apiErrorResponse);
    }
 }

