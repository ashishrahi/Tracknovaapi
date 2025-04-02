import { StatusCodes } from "http-status-codes";
import {
  ApiErrorResponse,
  ReturnData,
} from "../utils/apiResponse/index.js";
import {
    AddUpdateCityMasterQuery,
    GetCitiesByStateQuery,
    GetCityMasterQuery,
    DeleteCityMasterQuery,
} from "../utils/DBQueries/index.js";

//////////////////////////////////// AddUpdateCityMaster //////////////////////////////////////////////////////////////////

export async function AddUpdateCityMaster(req, res) {
    try {
      const model = req.body;
      const { isSuccess, internalSuccess, mesg, insertedId,data } =
        await AddUpdateCityMasterQuery(model);
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

//////////////////////////////////// GetCitiesByState //////////////////////////////////////////////////////////////////

export async function GetCitiesByState(req, res) {
  try {
    const model = req.params;
    // console.log('model:',model)
    const { isSuccess, internalSuccess, mesg, insertedId,data } = await GetCitiesByStateQuery(model);
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
  
////////////////////////////////////// GetCityMaster //////////////////////////////////////////////////////////////////

export async function GetCityMaster(req, res) {
    try {
      const model = req.body;
      const { isSuccess, internalSuccess, mesg, insertedId,data  } =
        await GetCityMasterQuery(model);
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



/////////////////////////////////////// DeleteCityMaster //////////////////////////////////
export async function DeleteCityMaster(req, res) {
    try {
      const model = req.body;
      const { isSuccess, internalSuccess, mesg, insertedId } =
        await DeleteCityMasterQuery(model);
      const successResponse = new ReturnData(
        isSuccess,
        internalSuccess,
        mesg,
        insertedId
        
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
