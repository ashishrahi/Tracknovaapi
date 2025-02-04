import { StatusCodes } from "http-status-codes";
import {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../utils/apiResponse/index.js";
import {
  AddUpdateBinLocationQuery,
  GetBinLocationQuery,
  DeleteBinLocationQuery,
} from "../utils/DBQueries/index.js";

////////////////////////////////////////////// AddUpdateBinLocation /////////////////////////////////////////////////////////

export async function AddUpdateBinLocation(req, res) {
  try {
    const model = req.body;
    const { data, isSuccess, message, statusCode } =
      await AddUpdateBinLocationQuery(model);
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

/////////////////////////////////// GetBinLocation /////////////////////////////////////////////////

export async function GetBinLocation(req, res) {
  try {
    const model = req.body;
    const {isSuccess,statusCode, message,data,pageNo,pageSize,rowCount  } =
      await GetBinLocationQuery(model);
    const successResponse = new ApiSuccessResponse(
      isSuccess,
      statusCode,
      message,
      data,
      pageNo,
      pageSize,
      rowCount
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

/////////////////////////////////// DeleteBinLocation /////////////////////////////////////////////////

export async function DeleteBinLocation(req, res) {
  try {
    const model = req.body;
    const { data, isSuccess, message, statusCode } =
      await DeleteBinLocationQuery(model);
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
