import { StatusCodes } from "http-status-codes";
import {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../utils/apiResponse/index.js";
import { GetDeviceTypeQuery } from "../utils/DBQueries/DeviceType.Query.js";
///////////////////////////////////////////////// GetDeviceType //////////////////////////////////////////////////

export async function GetDeviceType(req, res) {
  try {
    const model = req.body;
    const { data, isSuccess, message, statusCode } = await GetDeviceTypeQuery(
      model
    );
    const successResponse = new ApiSuccessResponse(
      isSuccess,
      statusCode,
      message,
      data
    );
    res.status(successResponse.statusCode).json(successResponse);
  } catch (error) {
    const errorResponse = new ApiErrorResponse(
      StatusCodes.BAD_REQUEST,
      error.message
    );
    res.status(errorResponse.statusCode).json(errorResponse);
  }
}
