import { StatusCodes } from "http-status-codes";
import {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../utils/apiResponse/index.js";
import {
    AddUpdateTaxMasterQuery,
    GetTaxMasterQuery,
    DeleteTaxMasterQuery,
} from "../utils/DBQueries/TaxMaster.Query.js";

///////////////////////////////////////////////////  AddUpdateTaxMaster  ////////////////////////////////////////////////////////

export async function AddUpdateTaxMaster(req,res){
    try {
        const model = req.body;
        const { isSuccess, statusCode, message, data } = await AddUpdateTaxMasterQuery(model);
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

//////////////////////////////////////////////////////  GetTaxMaster  ////////////////////////////////////////////////////////

export async function GetTaxMaster(req,res){
    try {
        const model = req.body;
        const { isSuccess, statusCode, message, data } = await GetTaxMasterQuery(model);
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

///////////////////////////////////////////////////// DeleteTaxMaster ////////////////////////////////////////////////////////

export async function DeleteTaxMaster(req,res){
    try {
        const model = req.body;
        const { isSuccess, statusCode, message, data } = await DeleteTaxMasterQuery(model);
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
