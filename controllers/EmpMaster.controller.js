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

//--------------------AddUpdateEmployee---------->
export async function AddUpdateEmployee(req, res, next) {
  try {
    const model = req.body;
    const response  = await AddUpdateEmployeeQuery(model, next);
  
    const successResponse = new ApiSuccessResponse(
      true,
      StatusCodes.OK,
      response.message,
      response.data
    );
    res.status(successResponse.statusCode).json(successResponse);
  } catch (err) {
    const error = new Error(err.message);
    error.status = err.statusCode || StatusCodes.BAD_REQUEST;
    return next(error);
  }
}

//-------------------GetEmployee------->

export async function GetEmployee(req, res, next) {
  try {
    const model = req.body;
    const response = await GetEmployeeQuery(model);

    const successResponse = new ApiSuccessResponse(
      response.status,
      StatusCodes.OK,
      "default",
      response.data,
      response.pageNo,
      response.pageSize,
      response.rowCount
    );
    return res.status(StatusCodes.OK).json(successResponse);
  } catch (err) {
    const error = new Error(err.message);
    error.status = err.statusCode || StatusCodes.BAD_REQUEST;
    return next(error);
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
      StatusCodes.BAD_REQUEST,
      error.message
    );
    res.status(errorResponse.statusCode).json(errorResponse);
  }
}

//-------------------DeleteEmployee------->
export async function DeleteEmployee(req, res) {
  try {
    const model = req.body;
    const response = await DeleteEmployeeQuery(model);
    const successResponse = new ApiSuccessResponse(
      true,
      StatusCodes.OK,
      response.message,
    );
    return res.status(successResponse.statusCode).json(successResponse);
  } catch (error) {
    const errorResponse = new ApiErrorResponse(
      StatusCodes.BAD_REQUEST,
     error.message
    );
    res.status(errorResponse.statusCode).json(errorResponse);
  }
}
