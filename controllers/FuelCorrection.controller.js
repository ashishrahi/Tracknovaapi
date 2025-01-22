import { StatusCodes } from "http-status-codes";
import {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../utils/apiResponse/index.js";
import {
    AddUpdateFuelCorrectionQuery,
    GetFuelCorrectionQuery,
    DeleteFuelCorrectionQuery,
} from "../utils/DBQueries/index.js";

//////////////////////////// AddUpdateFuelCorrection /////////////////////////////////// 

export async function AddUpdateFuelCorrection(req, res) {
    try {
      const model = req.body;
      const { data, isSuccess, message, statusCode } =
        await AddUpdateFuelCorrectionQuery(model);
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
/////////////////////////////////  GetFuelCorrection //////////////////////////////
export async function GetFuelCorrection(req, res) {
    try {
      const model = req.body;
      const { data, isSuccess, message, statusCode } =
        await GetFuelCorrectionQuery(model);
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

///////////////////////////////////   DeleteFuelCorrection /////////////////////////////////////////////////////

export async function DeleteFuelCorrection(req, res) {
    try {
      const model = req.body;
      const { data, isSuccess, message, statusCode } =
        await DeleteFuelCorrectionQuery(model);
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
