import { StatusCodes } from "http-status-codes";
import {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../utils/apiResponse/index.js";
import {
  AddUpdateBrandMasterQuery,
  GetBrandQuery,
  DeleteBrandQuery,
} from "../utils/DBQueries/index.js";

export async function AddUpdateBrandMaster(req, res) {
  try {
    const model = req.body;
    const { data, isSuccess, message, statusCode } =
      await AddUpdateBrandMasterQuery(model);
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
      StatusCodes.BAD_REQUEST,
      error.message
    );
    res.status(errorResponse.statusCode).json(errorResponse);
  }
}
export async function GetBrand(req, res) {
  try {
    const model = req.body;
    const { data, isSuccess, message, statusCode } = await GetBrandQuery(model);
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
      StatusCodes.BAD_REQUEST,
      error.message
    );
    res.status(errorResponse.statusCode).json(errorResponse);
  }
}
export async function DeleteBrand(req, res) {
  try {
    const model = req.body;

    const { data, isSuccess, message, statusCode } = await DeleteBrandQuery(
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
      false,
      StatusCodes.BAD_REQUEST,
      error.message
    );
    res.status(errorResponse.statusCode).json(errorResponse);
  }
}
