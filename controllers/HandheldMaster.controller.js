import { StatusCodes } from "http-status-codes";
import { ApiErrorResponse, ApiSuccessResponse } from "../utils/apiResponse/index.js";
import {
  AddUpdateHandheldMasterQuery,
  GetHandheldMasterQuery,
  DeleteHandheldMasterQuery,
} from "../utils/DBQueries/HandheldMaster.Query.js";

///////////////////////////////////////////////////////  AddUpdateHandheldMaster  ///////////////////////////////////////////////////////////////////
export async function AddUpdateHandheldMaster(req, res) {
  try {
    const model = req.body;
    const { status, message, data} =
      await AddUpdateHandheldMasterQuery(model);
    const successResponse = ApiSuccessResponse.common(
      status,
      message,
      data
    );
    res.status(StatusCodes.CREATED).json(successResponse);
  } catch (error) {
    const errorResponse = new ApiErrorResponse(
      StatusCodes.BAD_REQUEST,
      error.message
    );
    return res.status(errorResponse.StatusCode).json(errorResponse);
  }
}

////////////////////////////////////////////////////// GetHandheldMaster //////////////////////////////////////////////////////////////////

export async function GetHandheldMaster(req, res) {
  try {
    const model = req.body;
    const {status, message, data } =
      await GetHandheldMasterQuery(model);
    const successResponse = ApiSuccessResponse.common(
      status,
      message,
      data,
     );
    res.status(StatusCodes.OK).json(successResponse);
  } catch (error) {
    const errorResponse = new ApiErrorResponse(
      StatusCodes.BAD_REQUEST,
      error.message
    );
    return res.status(errorResponse.StatusCode).json(errorResponse);
  }
}

////////////////////////////////////////////////////// DeleteHandheldMaster //////////////////////////////////////////////////////////////////

export async function DeleteHandheldMaster(req, res) {
  try {
    const model = req.body;
    const {status, message, data } =
      await DeleteHandheldMasterQuery(model);
    const successResponse = ApiSuccessResponse.common(
      status,
      message,
      data,
    );
    res.status(StatusCodes.OK).json(successResponse);
  } catch (error) {
    const errorResponse = new ApiErrorResponse(
      StatusCodes.BAD_REQUEST,
      error.message
    );
    return res.status(errorResponse.StatusCode).json(errorResponse);
  }
}
