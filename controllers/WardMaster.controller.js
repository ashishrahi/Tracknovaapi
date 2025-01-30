import { StatusCodes } from "http-status-codes";
import {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../utils/apiResponse/index.js";
import {
    AddUpdateWardMasterQuery,
    GetWardMasterQuery,
    DeletetWardMasterQuery
} from "../utils/DBQueries/WardMaster.Query.js";

///////////////////////////////////////////////// AddUpdateWardMaster //////////////////////////////////////////////////

export async function AddUpdateWardMaster(req,res){
    try {
        const modal = req.body;
        const { isSuccess, statusCode, message, data } = await AddUpdateWardMasterQuery(modal);
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



/////////////////////////////////////////////////// GetWardMaster //////////////////////////////////////////////////

export async function GetWardMaster(req,res){
    try {
        const modal = req.body;
        const { isSuccess, statusCode, message, data } = await GetWardMasterQuery(modal);
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



////////////////////////////////////////////////// DeletetWardMaster //////////////////////////////////////////////////

export async function DeletetWardMaster(req,res){
    try {
        const modal = req.body;
        const { isSuccess, statusCode, message, data } = await DeletetWardMasterQuery(modal);
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