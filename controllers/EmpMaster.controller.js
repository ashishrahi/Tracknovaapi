import { StatusCodes } from "http-status-codes";
import {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../utils/apiResponse/index.js";
import {
  AddUpdateEmployeeQuery,
  GetEmployeeQuery,
  UpsertEmpPermissionQuery,
  DeleteEmployeeQuery,
} from "../utils/DBQueries/EmpMaster.Query.js";

//////////////////////////////  AddUpdateEmployee //////////////////////////////////////////////////////////////////
export async function AddUpdateEmployee(req, res) {
  try {
    const model = req.body;
    const { data, isSuccess, message, statusCode } =
      await AddUpdateEmployeeQuery(model);
    const successResponse = new ApiSuccessResponse(
      true,
      StatusCodes.OK,
      "Employee Data Fetched Successfully",
      result
    );
    res.status(successResponse.statusCode).json(successResponse);
  } catch (error) {
    const errorResponse = new ApiErrorResponse(
      false,
      StatusCodes.NOT_FOUND,
      "Failed to grant Access Permission"
    );
    res.status(errorResponse.statusCode).json(errorResponse);
  }
}

//////////////////////////////  GetEmployee  //////////////////////////////////////////////////////////////////

export async function GetEmployee(req, res) {
  try {
    const model = req.body;
    const { isSuccess, statusCode, message, data, pageNo, pageSize, rowCount } =
      await GetEmployeeQuery(model);

    const successResponse = new ApiSuccessResponse(
      isSuccess,
      statusCode,
      message,
      data,
      pageNo,
      pageSize,
      rowCount
    );
    res.status(200).json(successResponse);
  } catch (error) {
    const errorResponse = new ApiErrorResponse(
      false,
      StatusCodes.NOT_FOUND,
      "Failed to grant Access Permission"
    );
    res.status(errorResponse.statusCode).json(errorResponse);
  }
}

//////////////////////////////  UpsertEmpPermission  //////////////////////////////////////////////////////////////////

export async function UpsertEmpPermission(req, res) {
  try {
    const model = req.body;
    const { data, isSuccess, message, statusCode } =
      await UpsertEmpPermissionQuery(model);
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
      StatusCodes.NOT_FOUND,
      "Failed to grant Access Permission"
    );
    res.status(errorResponse.statusCode).json(errorResponse);
  }
}

//////////////////////////////  DeleteEmployee  //////////////////////////////////////////////////////////////////

export async function DeleteEmployee(req, res) {
  try {
    const model = req.body;
    const { data, isSuccess, message, statusCode } = await DeleteEmployeeQuery(
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
      false,
      StatusCodes.NOT_FOUND,
      "Failed to grant Access Permission"
    );
    res.status(errorResponse.statusCode).json(errorResponse);
  }
}
