import { StatusCodes } from "http-status-codes";
import { v2StateService } from "../../services/index.js";
import { ApiErrorResponse, ReturnData } from "../../utils/apiResponse/index.js";

export async function getState(req, res) {
    try {
      const { countryId } = req.query;
      // console.log("req.query", req.params)
      // return res.json(req.query)
  
      const {  isSuccess, internalSuccess, mesg, insertedId, data } =
        await v2StateService.getStatebyCountry(countryId);
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