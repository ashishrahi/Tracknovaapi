import { StatusCodes } from "http-status-codes";
import {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../utils/apiResponse/index.js";
import {
  AddUpdateDepartmentMasterQuery,
  GetDepartmentMasterQuery,
  DeleteDepartmentMasterQuery,
} from "../utils/DBQueries/index.js";

////////////////////////////  AddUpdateDepartmentMaster  //////////////////////////////////////////////////

export async function AddUpdateDepartmentMaster(req, res) {
  try {
    const model = req.body;
    const { data, isSuccess, message, statusCode } =
      await AddUpdateDepartmentMasterQuery(model);
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

////////////////////////////  GetDepartmentMaster  //////////////////////////////////////////////////

export async function GetDepartmentMaster(req, res) {
  try {
    const model = req.body;
    const { data, isSuccess, message, statusCode } =
      await GetDepartmentMasterQuery(model);
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

////////////////////////////  DeleteDepartmentMaster  //////////////////////////////////////////////////

export async function DeleteDepartmentMaster(req, res) {
  try {
    const model = req.body;
    const { isSuccess, message, statusCode } =
      await DeleteDepartmentMasterQuery(model);
    const successResponse = new ApiSuccessResponse(
      isSuccess,
      statusCode,
      message
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
