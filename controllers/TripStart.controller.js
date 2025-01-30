import { StatusCodes } from "http-status-codes";
import {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../utils/apiResponse/index.js";
import {
    TripStartEndQuery,
} from "../utils/DBQueries/TripStart.Query.js";

//////////////////////////////////////// TripStartEnd //////////////////////////////////////////

export async function TripStartEnd(req,res){
    try {
        const model = req.body;
        const { isSuccess, statusCode, message, data } = await TripStartEndQuery(model);
        const successResponse = new ApiSuccessResponse(
            isSuccess,
            statusCode,
            message,
            data
        );
        res.status(StatusCodes.OK).json(successResponse);

    } catch (error) {
        const apiErrorResponse = new ApiErrorResponse(
            StatusCodes.BAD_REQUEST, 
            error.message);
        res.status(apiErrorResponse.statusCode).json(apiErrorResponse);
    }
}