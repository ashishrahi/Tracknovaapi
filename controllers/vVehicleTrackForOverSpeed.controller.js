import { StatusCodes } from "http-status-codes";
import {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../utils/apiResponse/index.js";
import {
    GetOverSpeedAlertQuery,
    
} from "../utils/DBQueries/vVehicleTrackForOverSpeed.Query.js";


/////////////////////////////////////////////// GetOverSpeedAlert //////////////////////////////////////////////////////////////////
  
export async function GetOverSpeedAlert(req,res){
    try {
        const modal = req.body;
        const { isSuccess, statusCode, message, data } = await GetOverSpeedAlertQuery(modal);
        const successResponse = new ApiSuccessResponse(
            isSuccess,
            statusCode,
            message,
            data
        );
        res.status(StatusCodes.OK).json(successResponse);

    } catch (error) {
        const apiErrorResponse = new ApiErrorResponse(false, StatusCodes.BAD_REQUEST, error.message);
        res.status(apiErrorResponse.statusCode).json(apiErrorResponse);
    }
}
