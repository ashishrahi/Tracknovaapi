import { StatusCodes } from "http-status-codes";
import {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../utils/apiResponse/index.js";
import {
    AddUpdateZoneMasterQuery,
    GetZoneMasterQuery,
    DeleteZoneMasterQuery
} from "../utils/DBQueries/ZoneMaster.Query.js";


/////////////////////////////////////////////// AddUpdateZoneMaster //////////////////////////////////////////////////////////////////
  
export async function AddUpdateZoneMaster(req,res){
    try {
        const modal = req.body;
        const { isSuccess, statusCode, message, data } = await AddUpdateZoneMasterQuery(modal);
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



//////////////////////////////////////////////// GetZoneMaster //////////////////////////////////////////////////////////////////

export async function GetZoneMaster(req,res){
    try {
        const modal = req.body;
        const { isSuccess, statusCode, message, data } = await GetZoneMasterQuery(modal);
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

/////////////////////////////////////////////// DeleteZoneMaster //////////////////////////////////////////////////////////////////

export async function DeleteZoneMaster(req,res){
    try {
        const modal = req.body;
        const { isSuccess, statusCode, message, data } = await DeleteZoneMasterQuery(modal);
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