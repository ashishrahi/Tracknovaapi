import { StatusCodes } from "http-status-codes";
import { ApiErrorResponse, ApiSuccessResponse } from "../utils/apiResponse/index.js";
import {
  AddUpdateDepartmentMasterQuery,
  ImportDepartmentsQuery,
  GetDepartmentMasterQuery,
  DeleteDepartmentMasterQuery,
} from "../utils/DBQueries/index.js";

////////////////////////////  AddUpdateDepartmentMaster  //////////////////////////////////////////////////

export async function AddUpdateDepartmentMaster(req, res) {
  try {
    const model = req.body;
    const { isSuccess, internalSuccess, mesg, insertedId, data } =
      await AddUpdateDepartmentMasterQuery(model);
    const successResponse = ApiSuccessResponse.returnData(
      isSuccess,
      internalSuccess,
      mesg,
      insertedId,
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


////////////////////////////  ImportDepartments  //////////////////////////////////////////////////

export async function ImportDepartments(req, res) {
  try {
    const model = req.body;
    const { isSuccess, internalSuccess, mesg, insertedId, data } =
      await ImportDepartmentsQuery(model);
    const successResponse = ApiSuccessResponse.returnData(
      isSuccess,
      internalSuccess,
      mesg,
      insertedId,
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
    const successResponse = ApiSuccessResponse.returnData(
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
    const successResponse = ApiSuccessResponse.returnData(
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
