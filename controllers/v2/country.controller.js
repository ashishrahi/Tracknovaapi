import { StatusCodes } from "http-status-codes";
import { v2CountryService } from "../../services/index.js";
import { ApiErrorResponse, ReturnData } from "../../utils/apiResponse/index.js";

// addCountry
export async function addCountry(req, res) {
    try {
      const model = req.body;
      const { isSuccess, internalSuccess, mesg, insertedId, data} = await v2CountryService.addCountry(model);
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

// getCountry
export async function getCountry(req, res) {
    try {
      const model = req.body;  
      const {  isSuccess, internalSuccess, mesg, insertedId, data } =
        await v2CountryService.getCountry(model);
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

// deleteCountry 
  export async function deleteCountry(req, res) {
    try {
      const model = req.body;  
      const {  isSuccess, internalSuccess, mesg, insertedId, data } =
        await v2CountryService.deleteCountry(model);
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
  