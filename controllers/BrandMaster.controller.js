import { StatusCodes } from "http-status-codes";
import {
  ApiErrorResponse, CommonResponse,
  DBReturn,
} from "../utils/apiResponse/index.js";
import {
  AddUpdateBrandMasterQuery,
  GetBrandQuery,
  DeleteBrandQuery,
} from "../utils/DBQueries/index.js";

export async function AddUpdateBrandMaster(req, res) {
  try {
    const model = req.body;
    const { isSuccess, id, createUpdate, msg, data } = await AddUpdateBrandMasterQuery(model);
    const apiResponse = new DBReturn(
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
    const successResponse = new CommonResponse(
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
    const apiResponse = new DBReturn(isSuccess, id, createUpdate, msg, data);
    res.status(StatusCodes.OK).json(apiResponse);
  } catch (error) {
    const errorResponse = new ApiErrorResponse(
      StatusCodes.BAD_REQUEST,
      error.message
    );
    res.status(errorResponse.StatusCode).json(errorResponse);
  }
}
