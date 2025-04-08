import { StatusCodes } from "http-status-codes";
import {
  ApiErrorResponse,
  ReturnData,
} from "../utils/apiResponse/index.js";
import {
  AddUpdateCountryMasterQuery,
  GetCountryMasterQuery,
  DeleteCountryQuery,
} from "../utils/DBQueries/index.js";

///////////////////////////// AddUpdateCountryMaster /////////////////////////////////////////////////////////////

export async function AddUpdateCountryMaster(req, res) {
  try {
    const model = req.body;
    const { isSuccess, internalSuccess, mesg, insertedId, data} =
      await AddUpdateCountryMasterQuery(model);
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

////////////////////////////  GetCountryMaster //////////////////////////////////////////////////////////
export async function GetCountryMaster(req, res) {
  try {
    const model = req.body;

    const {  isSuccess, internalSuccess, mesg, insertedId, data } =
      await GetCountryMasterQuery(model);
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

////////////////////////////  DeleteCountryMaster  //////////////////////////////////////////////////////////

export async function DeleteCountryMaster(req, res) {
  try {
    const {countryId} = req.body;
    // console.log("model:",countryId)
    const { isSuccess, internalSuccess, mesg, insertedId, data  } = await DeleteCountryQuery(countryId);
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
