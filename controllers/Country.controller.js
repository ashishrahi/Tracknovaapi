import { StatusCodes } from "http-status-codes";
import {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../utils/apiResponse/index.js";
import {
  AddUpdateCountryMasterQuery,
  GetCountryMasterQuery,
  DeleteCountryQuery,
} from "../utils/DBQueries/index.js";

///////////////////////////// AddUpdateCountryMaster /////////////////////////////////////////////////////////////

export async function AddUpdateCountryMaster(req, res) {
  try {
    const model = req.body;
    const { data, isSuccess, message, statusCode } =
      await AddUpdateCountryMasterQuery(model);
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

////////////////////////////  GetCountryMaster //////////////////////////////////////////////////////////
export async function GetCountryMaster(req, res) {
  try {
    const model = req.body;

    const { data, isSuccess, message, statusCode } =
      await GetCountryMasterQuery(model);
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

////////////////////////////  DeleteCountryMaster  //////////////////////////////////////////////////////////

export async function DeleteCountryMaster(req, res) {
  try {
    const model = req.body;
    const { data, isSuccess, message, statusCode } = await DeleteCountryQuery(
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
