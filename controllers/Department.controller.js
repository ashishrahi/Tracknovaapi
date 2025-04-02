import { StatusCodes } from "http-status-codes";
import {
  ApiErrorResponse,
  ReturnData,
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
    const { isSuccess, internalSuccess, mesg, insertedId, data } =
      await AddUpdateDepartmentMasterQuery(model);
    const successResponse = new ReturnData(
      isSuccess,
      internalSuccess,
      insertedId,
      mesg,
      data
    );
    res.status(StatusCodes.CREATED).json(successResponse);
  } catch (error) {
    const errorResponse = new ApiErrorResponse(
      StatusCodes.BAD_REQUEST,
      error.message
    );
    res.status(errorResponse.StatusCode).json(errorResponse);
  }
}

////////////////////////////  GetDepartmentMaster  //////////////////////////////////////////////////

export async function GetDepartmentMaster(req, res) {
  try {
    const model = req.body;
    const { isSuccess, internalSuccess, mesg, insertedId, data } =
      await GetDepartmentMasterQuery(model);
    const successResponse = new ReturnData(
      isSuccess,
      internalSuccess,
      mesg,
      insertedId,
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

////////////////////////////  DeleteDepartmentMaster  //////////////////////////////////////////////////

export async function DeleteDepartmentMaster(req, res) {
  try {
    const model = req.body;
    const { isSuccess, internalSuccess, mesg, insertedId, data } =
      await DeleteDepartmentMasterQuery(model);
    const successResponse = new ReturnData  (
      isSuccess,
      internalSuccess,
      mesg,
      insertedId,
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
