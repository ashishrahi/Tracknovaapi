import { StatusCodes } from "http-status-codes";
import { ApiErrorResponse, ApiSuccessResponse } from "../utils/apiResponse/index.js";
import {
  AddUpdateDesignationMasterQuery,
  ImportDesignationQuery,
  GetDesignationMasterQuery,
  DeleteDesignationMasterQuery,
} from "../utils/DBQueries/index.js";
/////////////////////////////////////// AddUpdateDesignationMaster //////////////////////////////////////////////////////////////////

export async function AddUpdateDesignationmaster(req, res) {
  try {
    const model = req.body;
    const { isSuccess, internalSuccess, mesg, insertedId, data } =
      await AddUpdateDesignationMasterQuery(model);
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

/////////////////////////////////////// ImportDesignation //////////////////////////////////////////////////////////////////


export async function ImportDesignation(req, res) {
  try {
    const model = req.body;
    const { isSuccess, internalSuccess, mesg, insertedId, data } =
      await ImportDesignationQuery(model);
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

//////////////////////////////////////   GetDesignationMaster      ///////////////////////////////////////////////////////////////

export async function GetDesignationmaster(req, res) {
  try {
    const model = req.body;
    const { isSuccess, internalSuccess, mesg, insertedId, data } =
      await GetDesignationMasterQuery(model);
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

//////////////////////////////////////  DeleteDesignationMaster //////////////////////////////////////////////////////////////////////

export async function DeleteDesignationmaster(req, res) {
  try {
    const model = req.body;
    const { isSuccess, internalSuccess, mesg, insertedId, data } =
      await DeleteDesignationMasterQuery(model);
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
