import { StatusCodes } from "http-status-codes";
import {
  ApiErrorResponse,
  ApiSuccessResponse,
  CommonResponse
} from "../utils/apiResponse/index.js";
import {
  AddUpdateEmployeeQuery,
  ImportEmployeeQuery,
  GetEmployeeQuery,
  UpsertEmpPermissionQuery,
  DeleteEmployeeQuery,
} from "../utils/DBQueries/EmpMaster.Query.js";

//--------------------AddUpdateEmployee---------->
export async function AddUpdateEmployee(req, res, next) {
  try {
    const model = req.body;
    // console.log("model:",model)
    const response  = await AddUpdateEmployeeQuery(model);
  
    const successResponse = new CommonResponse(
      1,
      response.message,
      response.data
    );
    return res.status(StatusCodes.OK).json(successResponse);
  } catch (err) {
    const msg = err.message || err.ErrorMessage
    const statusCode = err.StatusCode
    console.log(err)
    // error.status = err.statusCode || err.StatusCode || StatusCodes.BAD_REQUEST;
    return next(new ApiErrorResponse(statusCode, msg));
  }
}

//--------------------ImportEmployee---------->

ImportEmployee
export async function ImportEmployee(req, res, next) {
  try {
    const model = req.body;
    // console.log("model:",model)
    const response  = await ImportEmployeeQuery(model);
  
    const successResponse = new CommonResponse(
      1,
      response.message,
      response.data
    );
    return res.status(StatusCodes.OK).json(successResponse);
  } catch (err) {
    const msg = err.message || err.ErrorMessage
    const statusCode = err.StatusCode
    console.log(err)
    // error.status = err.statusCode || err.StatusCode || StatusCodes.BAD_REQUEST;
    return next(new ApiErrorResponse(statusCode, msg));
  }
}

//-------------------GetEmployee------->

export async function GetEmployee(req, res, next) {
  try {
    console.log("get employee starts")
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
    const company = req.company
    const response =
      await UpsertEmpPermissionQuery(model, res, company);
    // const successResponse = new ApiSuccessResponse(
    //   isSuccess,
    //   statusCode,
    //   message,
    //   data 
    // );
    return res.status(200).json(new CommonResponse(1, response.message,  response.data, response.rowCount));
  } catch (error) {
      // return res.status(StatusCodes.BAD_REQUEST).json(new ApiErrorResponse(error.message))
      const code = error.StatusCode || error.statusCode;
      const msg = error.ErrorMessage || error.message;
    const err = new ApiErrorResponse(code, msg);
    // err.status = error.statusCode || StatusCodes.BAD_REQUEST
    // console.log(error)
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
