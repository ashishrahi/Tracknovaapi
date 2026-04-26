import { StatusCodes } from "http-status-codes";
import { v2CityService } from "../../services/index.js";
import { ApiErrorResponse, ApiSuccessResponse } from "../../utils/apiResponse/index.js";

// AddCity

export async function addCity(req, res) {
    try {
      const model = req.body;
      const {  isSuccess, internalSuccess, mesg, insertedId, data } =
        await v2CityService.addCity(model);
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

// CityList
export async function cityList(req, res) {
  try {
    const model = req.body;
    const {  isSuccess, internalSuccess, mesg, insertedId, data } =
      await v2CityService.cityList(model);
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

// GetCity
export async function getCity(req, res) {
    try {
      const { stateId } = req.query;
      // console.log("req.query", req.params)
      // return res.json(req.query)
  
      const {  isSuccess, internalSuccess, mesg, insertedId, data } =
        await v2CityService.getCitybyState(stateId);
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

// DeleteList
export async function deleteCity(req, res) {
  try {
    const model = req.body;
    const {  isSuccess, internalSuccess, mesg, insertedId, data } =
      await v2CityService.deleteCity(model);
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
