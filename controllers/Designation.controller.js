import { StatusCodes } from "http-status-codes";
import {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../utils/apiResponse/index.js";
import {
  AddUpdateDesignationMasterQuery,
  GetDesignationMasterQuery,
  DeleteDesignationMasterQuery,
} from "../utils/DBQueries/index.js";
/////////////////////////////////////// AddUpdateDesignationMaster //////////////////////////////////////////////////////////////////

export async function AddUpdateDesignationMaster(req, res) {
  try {
    const model = req.body;
    const { data, isSuccess, message, statusCode } =
      await AddUpdateDesignationMasterQuery(model);
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

//////////////////////////////////////   GetDesignationMaster      ///////////////////////////////////////////////////////////////

export async function GetDesignationMaster(req, res) {
  try {
    const model = req.body;
    const { data, isSuccess, message, statusCode } =
      await GetDesignationMasterQuery(model);
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

//////////////////////////////////////  DeleteDesignationMaster //////////////////////////////////////////////////////////////////////

export async function DeleteDesignationMaster(req, res) {
  try {
    const model = req.body;
    const { data, isSuccess, message, statusCode } =
      await DeleteDesignationMasterQuery(model);
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
