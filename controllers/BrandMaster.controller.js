import { StatusCodes } from "http-status-codes";
import { ApiErrorResponse, ApiSuccessResponse } from "../utils/apiResponse/index.js";
import {
  AddUpdateBrandMasterQuery,
  ImportBrandsQuery,
  GetBrandQuery,
  DeleteBrandQuery,
} from "../utils/DBQueries/index.js";

// AddUpdate Brand
export async function AddUpdateBrandMaster(req, res) {
  try {
    const model = req.body;
    const { isSuccess, id, createUpdate, msg, data } = await AddUpdateBrandMasterQuery(model);
    const apiResponse = ApiSuccessResponse.dbReturn(
      isSuccess,
      id,
      createUpdate,
      msg,
      data
    );
    res.status(StatusCodes.CREATED).json(apiResponse);
  } catch (error) {
    const errorResponse = new ApiErrorResponse(
      StatusCodes.BAD_REQUEST,
      error.message
    );
    res.status(errorResponse.StatusCode).json(errorResponse);
  }
}

// ImportBrands
export async function ImportBrands(req, res) {
  try {
    const model = req.body;
    const { isSuccess, id, createUpdate, msg, data } = await ImportBrandsQuery(model);
    const apiResponse = ApiSuccessResponse.dbReturn(
      isSuccess,
      id,
      createUpdate,
      msg,
      data
    );
    res.status(StatusCodes.CREATED).json(apiResponse);
  } catch (error) {
    const errorResponse = new ApiErrorResponse(
      StatusCodes.BAD_REQUEST,
      error.message
    );
    res.status(errorResponse.StatusCode).json(errorResponse);
  }
}

export async function GetBrand(req, res) {
  try {
    const model = req.body;
    const { status, message, data, } = await GetBrandQuery(model);
    const successResponse = ApiSuccessResponse.common(
      status,
      message,
      data
    );
    return res.status(StatusCodes.OK).json(successResponse);
  } catch (error) {
    const errorResponse = new ApiErrorResponse(
      StatusCodes.BAD_REQUEST,
      error.message
    );
    return res.status(errorResponse.StatusCode).json(errorResponse);
  }
}
export async function DeleteBrand(req, res) {
  try {
    const model = req.body;

    const { isSuccess, id, createUpdate, msg, data } = await DeleteBrandQuery(model);
    const apiResponse = ApiSuccessResponse.dbReturn(isSuccess, id, createUpdate, msg, data);
    res.status(StatusCodes.OK).json(apiResponse);
  } catch (error) {
    const errorResponse = new ApiErrorResponse(
      StatusCodes.BAD_REQUEST,
      error.message
    );
    res.status(errorResponse.StatusCode).json(errorResponse);
  }
}
