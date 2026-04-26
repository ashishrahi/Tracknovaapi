import { StatusCodes } from "http-status-codes";
import { ApiErrorResponse, ApiSuccessResponse } from "../utils/apiResponse/index.js";
import {
    AddUpdatelocationQuery,
    GetlocationClientQuery,
} from "../utils/DBQueries/Traccar.Query.js";



/////////////////////////////////////////////// AddUpdatelocation //////////////////////////////////////////////////////////////////
  
export async function AddUpdatelocation(req,res){
    try {
        const model = req.body;
        const { isSuccess, statusCode, message, data } = await AddUpdatelocationQuery(model);
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

//////////////////////////////////////////////// GetlocationClient //////////////////////////////////////////////////////////////////

export async function GetlocationClient(req,res){
    try {
        const model = req.body;
        const { isSuccess, statusCode, message, data } = await GetlocationClientQuery(model);
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