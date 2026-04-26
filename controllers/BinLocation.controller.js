import { StatusCodes } from "http-status-codes";
import { ApiErrorResponse, ApiSuccessResponse } from "../utils/apiResponse/index.js";
import {
  AddUpdateBinLocationQuery,
  GetBinLocationQuery,
  DeleteBinLocationQuery,
} from "../utils/DBQueries/index.js";

////////////////////////////////////////////// AddUpdateBinLocation /////////////////////////////////////////////////////////

export async function AddUpdateBinLocation(req, res) {
  try {
    const model = req.body;
    const { status, message, data } =
      await AddUpdateBinLocationQuery(model);
    const successResponse = ApiSuccessResponse.common(
      status,
      message,
      data,
    );
    res.status(StatusCodes.CREATED).json(successResponse);
  } catch (error) {
    const errorResponse = new ApiErrorResponse(
      StatusCodes.BAD_REQUEST,
      error.message
    );
    res.status(errorResponse.StatusCode).json(errorResponse);
  }
}

/////////////////////////////////// GetBinLocation /////////////////////////////////////////////////

export async function GetBinLocation(req, res) {
  try {
    const model = req.body;
    const {status, message, data,rowCount } =
      await GetBinLocationQuery(model);
    const successResponse = ApiSuccessResponse.common(
      status,
      message,
      data,
      rowCount
    );
    res.status(StatusCodes.OK).json(successResponse);
  } catch (error) {
    const errorResponse = new ApiErrorResponse(
      StatusCodes.BAD_REQUEST,
      error.message
    );
    res.status(errorResponse.StatusCode).json(errorResponse);
  }
}

/////////////////////////////////// DeleteBinLocation /////////////////////////////////////////////////

export async function DeleteBinLocation(req, res) {
  try {
    const model = req.body;
    const { status, message, data  } =
      await DeleteBinLocationQuery(model);
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
    res.status(errorResponse.StatusCode).json(errorResponse);
  }
}
