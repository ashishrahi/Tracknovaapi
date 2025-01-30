import { StatusCodes } from "http-status-codes";
import {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../utils/apiResponse/index.js";
import {
    AddUpdateCityMasterQuery,
    GetCityMasterQuery,
    DeleteCityMasterQuery,
} from "../utils/DBQueries/index.js";

//////////////////////////////////// AddUpdateCityMaster //////////////////////////////////////////////////////////////////

export async function AddUpdateCityMaster(req, res) {
    try {
      const model = req.body;
      const { data, isSuccess, message, statusCode } =
        await AddUpdateCityMasterQuery(model);
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
  




////////////////////////////////////// GetCityMaster //////////////////////////////////////////////////////////////////

export async function GetCityMaster(req, res) {
    try {
      const model = req.body;
      const { data, isSuccess, message, statusCode } =
        await GetCityMasterQuery(model);
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



/////////////////////////////////////// DeleteCityMaster //////////////////////////////////
export async function DeleteCityMaster(req, res) {
    try {
      const model = req.body;
      const { isSuccess, message, statusCode } =
        await DeleteCityMasterQuery(model);
      const successResponse = new ApiSuccessResponse(
        isSuccess,
        statusCode,
        message,
        
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
