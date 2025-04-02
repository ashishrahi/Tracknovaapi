import { StatusCodes } from "http-status-codes";
import {
  ApiErrorResponse,
  DBReturn,
  CommonResponse
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
    const { isSuccess, id, createUpdate, msg, data } =
      await AddUpdateFuelTypeQuery(model);
    const successResponse = new DBReturn(
      isSuccess,
      id,
      createUpdate,
      msg,
      data
    );
    res.status(StatusCodes.OK).json(successResponse);
  } catch (error) {
    const errorResponse = new ApiErrorResponse(
      StatusCodes.BAD_REQUEST,
      error.message
    );
    res.status(errorResponse.StatusCode).json(errorResponse);
  }
}

///////////////////////////////////////  GetFuelType //////////////////////////////////////////////////////////////////
export async function GetFuelType(req, res) {
  try {
    const model = req.body;
    const { status, message, data } = await GetFuelTypeQuery(
      model
    );
    const successResponse = new CommonResponse(
      status,
      message,
      data,
    );
    res.status(StatusCodes.OK).json(successResponse);
  } catch (error) {
    const errorResponse = new ApiErrorResponse(
      StatusCodes.BAD_REQUEST,
      error.message
    );
    res.status(errorResponse.StatusCode).json(errorResponse);
  }
}

/////////////////////////////////////// DeleteFuelType //////////////////////////////////////////////////////////////////
export async function DeleteFuelType(req, res) {
  try {
    const model = req.body;
    const {isSuccess, id, createUpdate, msg, data } = await DeleteFuelTypeQuery(
      model
    );
    const successResponse = new DBReturn(
      isSuccess,
      id,
      createUpdate,
      msg,
      data
    );
    res.status(StatusCodes.OK).json(successResponse);
  } catch (error) {
    const errorResponse = new ApiErrorResponse(
      StatusCodes.BAD_REQUEST,
      error.message
    );
    res.status(errorResponse.StatusCode).json(errorResponse);
  }
}
