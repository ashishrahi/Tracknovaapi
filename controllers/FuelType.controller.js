import { StatusCodes } from "http-status-codes";
import {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../utils/apiResponse/index.js";
import {
  AddUpdateFuelTypeQuery,
  GetFuelTypeQuery,
  DeleteFuelTypeQuery,
} from "../utils/DBQueries/FuelType.Query.js";

/////////////////////////////////////// AddUpdateFuelType //////////////////////////////////////////////////////////////////////////////////////////////////
export async function AddUpdateFuelType(req, res) {
  try {
    const model = req.body;
    const { isSuccess, statusCode, message, data } =
      await AddUpdateFuelTypeQuery(model);
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

///////////////////////////////////////  GetFuelType //////////////////////////////////////////////////////////////////
export async function GetFuelType(req, res) {
  try {
    const model = req.body;
    const { data, isSuccess, message, statusCode } = await GetFuelTypeQuery(
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

/////////////////////////////////////// DeleteFuelType //////////////////////////////////////////////////////////////////
export async function DeleteFuelType(req, res) {
  try {
    const model = req.body;
    const { data, isSuccess, message, statusCode } = await DeleteFuelTypeQuery(
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
