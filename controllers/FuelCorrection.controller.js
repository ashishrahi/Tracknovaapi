import { StatusCodes } from "http-status-codes";
import {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../utils/apiResponse/index.js";
import {
    AddUpdateFuelCorrectionQuery,
    GetVehListQuery,
} from "../utils/DBQueries/index.js";
import { CommonResponse } from "../utils/apiResponse/index.js";

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
        StatusCodes.BAD_REQUEST,
        error.message
      );
      res.status(errorResponse.StatusCode).json(errorResponse);
    }
  }
/////////////////////////////////  GetFuelCorrection //////////////////////////////
export async function GetVehList(req, res) {
    try {
      const model = req.body;
      // console.log("model",model)
      const { status, message, data,  rowCount} =
        await GetVehListQuery(model);
      const successResponse = new CommonResponse(
        status,
        message,
        data,
        rowCount
      );
      return res.status(StatusCodes.OK).json(successResponse);
    } catch (error) {
      const errorResponse = new ApiErrorResponse(
        StatusCodes.BAD_REQUEST,
        error.message || error.ErrorMessage
      );
      return res.status(errorResponse.StatusCode).json(errorResponse);
    }
  }

