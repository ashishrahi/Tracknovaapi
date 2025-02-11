import { StatusCodes } from "http-status-codes";
import {
  ApiErrorResponse,
  CommonResponse,
} from "../utils/apiResponse/index.js";
import { GetDeviceTypeQuery } from "../utils/DBQueries/DeviceType.Query.js";
///////////////////////////////////////////////// GetDeviceType //////////////////////////////////////////////////

export async function GetDeviceType(req, res) {
  try {
    const model = req.body;
    const { status, message, data,pageNo,pageSize,rowCount } = await GetDeviceTypeQuery(
      model
    );
    const successResponse = new CommonResponse(
      status,
      message,
      data,
      pageNo,
      pageSize,
      rowCount,
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
