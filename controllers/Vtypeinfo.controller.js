import { StatusCodes } from "http-status-codes";
import {
  ApiErrorResponse,
  ApiSuccessResponse,
  CommonResponse,
} from "../utils/apiResponse/index.js";
import {
    AddUpdateVtypeinfoQuery,
    getVtypeinfoQuery,
    DeleteVtypeinfoQuery
} from "../utils/DBQueries/Vtypeinfo.Query.js";



///////////////////////////////////////////////// AddUpdateVtypeinfo //////////////////////////////////////////////////

export async function AddUpdateVtypeinfo(req,res){
    try {
        const modal = req.body;
        const { isSuccess, statusCode, message, data } = await AddUpdateVtypeinfoQuery(modal);
        const successResponse = new ApiSuccessResponse(
            isSuccess,
            statusCode,
            message,
            data
        );
        res.status(StatusCodes.OK).json(successResponse);

    } catch (error) {
        const apiErrorResponse = new ApiErrorResponse(false, StatusCodes.BAD_REQUEST, error.message);
        res.status(apiErrorResponse.StatusCode).json(apiErrorResponse);
    }
}


///////////////////////////////////////////////// getVtypeinfo //////////////////////////////////////////////////

export async function getVtypeinfo(req,res){
    try {
        const modal = req.body;
        const {  message, data } = await getVtypeinfoQuery(modal);
        const successResponse = new CommonResponse(
            true,
            message,
            data
        );
        return res.status(StatusCodes.OK).json(successResponse);

    } catch (error) {
        const apiErrorResponse = new ApiErrorResponse(
            StatusCodes.BAD_REQUEST, 
            error.message);
        return res.status(StatusCodes.BAD_REQUEST).json(apiErrorResponse);
    }
}

///////////////////////////////////////////////// DeleteVtypeinfo //////////////////////////////////////////////////

export async function DeleteVtypeinfo(req,res){
    try {
        const modal = req.body;
        const { isSuccess, statusCode, message, data } = await DeleteVtypeinfoQuery(modal);
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
        res.status(apiErrorResponse.StatusCode).json(apiErrorResponse);
    }
}