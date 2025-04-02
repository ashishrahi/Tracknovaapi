import { StatusCodes } from "http-status-codes";
import { v2CountryService } from "../../services/index.js";
import { ApiErrorResponse, ReturnData } from "../../utils/apiResponse/index.js";

export async function addUpdateCountryMaster(req, res) {
    try {
      const model = req.body;
      const { isSuccess, internalSuccess, mesg, insertedId, data} = await v2CountryService.getCountry(model);
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