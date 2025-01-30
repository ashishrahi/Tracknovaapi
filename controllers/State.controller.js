import { StatusCodes } from "http-status-codes";
import {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../utils/apiResponse/index.js";
import {
    AddUpdateStateQuery,
    GetStateQuery,
    DeleteStateQuery,
} from "../utils/DBQueries/State.Query.js";

//////////////////////////////////////////////// AddUpdateState //////////////////////////////////////////////////////////////////
export async function AddUpdateState(req,res){
    try {
        const model = req.body;
        const { isSuccess, statusCode, message, data } = await AddUpdateStateQuery(model);
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


/////////////////////////////////////////////////// GetState //////////////////////////////////////////////////////////////////


export async function GetState(req,res){
    try {
        const model = req.body;
        const { isSuccess, statusCode, message, data } = await GetStateQuery(model);
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



//////////////////////////////////////////////////// DeleteState //////////////////////////////////////////////////////////////////

export async function DeleteState(req,res){
    try {
        const model = req.body;
        const { isSuccess, statusCode, message, data } = await DeleteStateQuery(model);
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