import { StatusCodes } from "http-status-codes";
import {
  ApiErrorResponse,
  ApiSuccessResponse,
  CommonResponse,
} from "../utils/apiResponse/index.js";
import { GetDeviceTypeQuery } from "../utils/DBQueries/DeviceType.Query.js";
///////////////////////////////////////////////// GetDeviceType //////////////////////////////////////////////////

export async function GetDeviceType(req, res) {
  try {
    const model = req.body;
    const { data, rowCount, message } = await GetDeviceTypeQuery(
      model
    );
    const successResponse = new CommonResponse(
      true,
      message,
      data
    );
    res.status(StatusCodes.OK).json(successResponse);
  } catch (error) {
    const errorResponse = new ApiErrorResponse(
      StatusCodes.BAD_REQUEST,
      error.message
    );
    res.status(errorResponse.statusCode).json(errorResponse);
  }
}
