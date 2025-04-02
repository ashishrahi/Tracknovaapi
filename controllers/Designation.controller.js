import { StatusCodes } from "http-status-codes";
import { ApiErrorResponse, ReturnData } from "../utils/apiResponse/index.js";
import {
  AddUpdateDesignationMasterQuery,
  GetDesignationMasterQuery,
  DeleteDesignationMasterQuery,
} from "../utils/DBQueries/index.js";
/////////////////////////////////////// AddUpdateDesignationMaster //////////////////////////////////////////////////////////////////

export async function AddUpdateDesignationmaster(req, res) {
  try {
    const model = req.body;
    const { isSuccess, internalSuccess, mesg, insertedId, data } =
      await AddUpdateDesignationMasterQuery(model);
    const successResponse = new ReturnData(
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

//////////////////////////////////////  DeleteDesignationMaster //////////////////////////////////////////////////////////////////////

export async function DeleteDesignationmaster(req, res) {
  try {
    const model = req.body;
    const { isSuccess, internalSuccess, mesg, insertedId, data } =
      await DeleteDesignationMasterQuery(model);
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
