import { StatusCodes } from "http-status-codes";
import { v2CityService } from "../../services/index.js";
import { ApiErrorResponse, ReturnData } from "../../utils/apiResponse/index.js";

export async function getCity(req, res) {
    try {
      const { stateId } = req.query;
      // console.log("req.query", req.params)
      // return res.json(req.query)
  
      const {  isSuccess, internalSuccess, mesg, insertedId, data } =
        await v2CityService.getCitybyState(stateId);
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