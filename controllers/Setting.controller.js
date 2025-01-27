import { StatusCodes } from "http-status-codes";
import {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../utils/apiResponse/index.js";
import {
    AddUpdateSettingQuery,
    GetSettingQuery,
    DeleteSettingQuery,
} from "../utils/DBQueries/index.js";
/////////////////////////////////////////////  AddUpdateSetting //////////////////////////////////////////////////////////////////

export async function AddUpdateSetting(req,res){
    try {
        const model = req.body;
        const { isSuccess, statusCode, message, data,pageNo,pageSize,rowCount } = await AddUpdateSettingQuery(model);
        const successResponse = new ApiSuccessResponse(
            isSuccess,
            statusCode,
            message,
            data,
            pageNo,
            pageSize,
            rowCount,
        );
        res.status(StatusCodes.OK).json(successResponse);

    } catch (error) {
        const apiErrorResponse = new ApiErrorResponse(false, StatusCodes.BAD_REQUEST, error.message);
        res.status(apiErrorResponse.statusCode).json(apiErrorResponse);
    }
}


////////////////////////////////////////////// GetSetting //////////////////////////////////////////////////////////////////

export async function GetSetting(req,res){
    try {
        const model = req.body;
        const { isSuccess, statusCode, message, data,pageNo,pageSize,rowCount } = await GetSettingQuery(model);
        const successResponse = new ApiSuccessResponse(
            isSuccess,
            statusCode,
            message,
            data,
            pageNo,
            pageSize,
            rowCount,
        );
        res.status(StatusCodes.OK).json(successResponse);

    } catch (error) {
        const apiErrorResponse = new ApiErrorResponse(false, StatusCodes.BAD_REQUEST, error.message);
        res.status(apiErrorResponse.statusCode).json(apiErrorResponse);
    }
}

////////////////////////////////////////////// DeleteSetting //////////////////////////////////////////////////////////////////
export async function DeleteSetting(req,res){
    try {
        const model = req.body;
        const { isSuccess, statusCode, message, data,pageNo,pageSize,rowCount } = await DeleteSettingQuery(model);
        const successResponse = new ApiSuccessResponse(
            isSuccess,
            statusCode,
            message,
            data,
            pageNo,
            pageSize,
            rowCount,
        );
        res.status(StatusCodes.OK).json(successResponse);

    } catch (error) {
        const apiErrorResponse = new ApiErrorResponse(false, StatusCodes.BAD_REQUEST, error.message);
        res.status(apiErrorResponse.statusCode).json(apiErrorResponse);
    }
}