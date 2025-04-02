import { StatusCodes } from "http-status-codes";
import {
  CommonResponse,
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
    const { status, message, data} =
      await AddUpdateGeoFencingQuery(model);
    const successResponse = new CommonResponse(
      status,
      message,
      data,
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
//////////////////////////////////////////////// GetGeoFencing //////////////////////////////////////////////////////////////////
export async function GetGeoFencing(req, res) {
  try {
    const model = req.body;
    
    const { status, message, data } = await GetGeoFencingQuery(
      model
    );
    const successResponse = new CommonResponse(
      status,
      message,
      data,
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

//////////////////////////////////////////////// DeleteGeoFencing //////////////////////////////////////////////////////////////////
export async function DeleteGeoFencing(req, res) {
  try {
    const model = req.body;
    const { status, message, data } =
      await DeleteGeoFencingQuery(model);
    const successResponse = new CommonResponse(
      status,
      message,
      data,
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
