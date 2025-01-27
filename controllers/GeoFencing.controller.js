import { StatusCodes } from "http-status-codes";
import {
  ApiSuccessResponse,
  ApiErrorResponse,
} from "../utils/apiResponse/index.js";
import {
  AddUpdateGeoFencingQuery,
  GetGeoFencingQuery,
  DeleteGeoFencingQuery,
} from "../utils/DBQueries/GeoFencing.Query.js";
/////////////////////////////////////////////// AddUpdateGeoFencing //////////////////////////////////////////////////////////////////

export async function AddUpdateGeoFencing(req, res) {
  try {
    const model = req.body;
    const { isSuccess, statusCode, message, data } =
      await AddUpdateGeoFencingQuery(model);
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
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Error occurred while updating",
      error
    );
    res.status(errorResponse.statusCode).json(errorResponse);
  }
}
//////////////////////////////////////////////// GetGeoFencing //////////////////////////////////////////////////////////////////
export async function GetGeoFencing(req, res) {
  try {
    const model = req.body;
    
    const { isSuccess, message, statusCode, data } = await GetGeoFencingQuery(
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
      StatusCodes.BAD_REQUEST,
      error.message
    );
    res.status(errorResponse.statusCode).json(errorResponse);
  }
}

//////////////////////////////////////////////// DeleteGeoFencing //////////////////////////////////////////////////////////////////
export async function DeleteGeoFencing(req, res) {
  try {
    const model = req.body;
    const { data, isSuccess, message, statusCode } =
      await DeleteGeoFencingQuery(model);
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
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Error occurred while deleting",
      error
    );
    res.status(errorResponse.statusCode).json(errorResponse);
  }
}
