import { StatusCodes } from "http-status-codes";
import {
  ApiErrorResponse,
  ApiSuccessResponse,
  CommonResponse
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

    const successResponse = new CommonResponse(
      response.status,
      response.message, 
      response.data, 
    //   response.status,
    //   StatusCodes.OK,
    //   "default",
    //   response.data,
      response.pageNo,
      response.pageSize,
      response.rowCount
    // 
    )
    return res.status(StatusCodes.OK).json(successResponse);
  } catch (err) {
    const error = new Error(err.message);
    error.status = err.statusCode || StatusCodes.BAD_REQUEST;
    return next(error);
  }
}

//////////////////////////////  UpsertEmpPermission  //////////////////////////////////////////////////////////////////

export async function UpsertEmpPermission(req, res, next) {
  try {
    const model = req.body;
    const response =
      await UpsertEmpPermissionQuery(model);
    // const successResponse = new ApiSuccessResponse(
    //   isSuccess,
    //   statusCode,
    //   message,
    //   data 
    // );
    return res.status(200).json(response);
  } catch (error) {
    const err = new Error(error.message);
    err.status = error.statusCode || StatusCodes.BAD_REQUEST
    console.log(error)
    return next(err);
  }
}

//-------------------DeleteEmployee------->
export async function DeleteEmployee(req, res, next) {
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
    const err = new Error(error.message);
    err.status = error.statusCode || StatusCodes.BAD_REQUEST;
    return next(error);
  }
}
