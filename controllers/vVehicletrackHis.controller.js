import { StatusCodes } from "http-status-codes";
import { ApiErrorResponse, ApiSuccessResponse } from "../utils/apiResponse/index.js";
import {
    GetvVehicletrackHisQuery,
} from "../utils/DBQueries/vVehicletrackHis.Query.js";

///////////////////////////////////////////////// GetvVehicletrackHis //////////////////////////////////////////////////

export async function GetvVehicletrackHis(req,res){
    try {
        const modal = req.body;
        const { status, message, data} = await GetvVehicletrackHisQuery(modal);
        const successResponse = ApiSuccessResponse.common(
            status,
            message,
            data,
        );
      return res.status(StatusCodes.OK).json(successResponse);

    } catch (error) {
        const apiErrorResponse = new ApiErrorResponse(
            StatusCodes.BAD_REQUEST, 
            error.message);
      return res.status(apiErrorResponse.StatusCode).json(apiErrorResponse);
    }
}