import { StatusCodes } from "http-status-codes";
import {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../utils/apiResponse/index.js";
import {
  AddUpdateHandheldMasterQuery,
  GetHandheldMasterQuery,
  DeleteHandheldMasterQuery,
} from "../utils/DBQueries/HandheldMaster.Query.js";

///////////////////////////////////////////////////////  AddUpdateHandheldMaster  ///////////////////////////////////////////////////////////////////
export async function AddUpdateHandheldMaster(req, res) {
  try {
    const model = req.body;
    const { isSuccess, statusCode, message, data } =
      await AddUpdateHandheldMasterQuery(model);
    const successResponse = new ApiSuccessResponse(
      isSuccess,
      statusCode,
      message,
      data
    );
    res.status(successResponse.statusCode).json(successResponse);
  } catch (error) {
    const errorResponse = new ApiErrorResponse(
      false,
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Internal Server Error",
      error.message
    );
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
}

////////////////////////////////////////////////////// GetHandheldMaster //////////////////////////////////////////////////////////////////

export async function GetHandheldMaster(req, res) {
  try {
    const model = req.body;
    const { isSuccess, statusCode, message, data, pageNo, pageSize, rowCount } =
      await GetHandheldMasterQuery(model);
    const successResponse = new ApiSuccessResponse(
      isSuccess,
      statusCode,
      message,
      data,
      pageNo,
      pageSize,
      rowCount
    );
    res.status(200).json(successResponse);
  } catch (error) {
    const errorResponse = new ApiErrorResponse(
      false,
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Internal Server Error",
      error.message
    );
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
}

////////////////////////////////////////////////////// DeleteHandheldMaster //////////////////////////////////////////////////////////////////

export async function DeleteHandheldMaster(req, res) {
  try {
    const model = req.body;
    const { data, isSuccess, message, statusCode } =
      await DeleteHandheldMasterQuery(model);
    const successResponse = new ApiSuccessResponse(
      isSuccess,
      statusCode,
      message,
      data
    );
    res.status(successResponse.statusCode).json(successResponse);
  } catch (error) {
    const errorResponse = new ApiErrorResponse(
      false,
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Internal Server Error",
      error.message
    );
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
}
