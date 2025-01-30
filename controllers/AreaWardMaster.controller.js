import { StatusCodes } from "http-status-codes";
import {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../utils/apiResponse/index.js";
import {
    AddUpdateAreaWardMasterQuery,
    GetAreaWardMasterQuery,
    DeleteAreaWardMasterQuery
} from "../utils/DBQueries/AreaWardMaster.Query.js";


/////////////////////////////////////////////// AddUpdateAreaWardMaster //////////////////////////////////////////////////////////////////
  
export async function AddUpdateAreaWardMaster(req,res){
    try {
        const modal = req.body;
        const { isSuccess, statusCode, message, data } = await AddUpdateAreaWardMasterQuery(modal);
        const successResponse = new ApiSuccessResponse(
            isSuccess,
            statusCode,
            message,
            data
        );
        res.status(StatusCodes.OK).json(successResponse);

    } catch (error) {
        const apiErrorResponse = new ApiErrorResponse( StatusCodes.BAD_REQUEST, error.message);
        res.status(apiErrorResponse.statusCode).json(apiErrorResponse);
    }
}

/////////////////////////////////////////////// GetAreaWardMaster //////////////////////////////////////////////////////////////////

export async function GetAreaWardMaster(req,res){
    try {
        const modal = req.body;
        const { isSuccess, statusCode, message, data,pageNo,pageSize,RowCount } = await GetAreaWardMasterQuery(modal);
        const successResponse = new ApiSuccessResponse(
            isSuccess,
            statusCode,
            message,
            data,
            pageNo,
            pageSize,
            RowCount,
        );
        res.status(StatusCodes.OK).json(successResponse);

    } catch (error) {
        const apiErrorResponse = new ApiErrorResponse( StatusCodes.BAD_REQUEST, error.message);
        res.status(apiErrorResponse.statusCode).json(apiErrorResponse);
    }
}




/////////////////////////////////////////////// DeleteAreaWardMaster //////////////////////////////////////////////////////////////////

export async function DeleteAreaWardMaster(req,res){
    try {
        const modal = req.body;
        const { isSuccess, statusCode, message, data } = await DeleteAreaWardMasterQuery(modal);
        const successResponse = new ApiSuccessResponse(
            isSuccess,
            statusCode,
            message,
            data
        );
        res.status(StatusCodes.OK).json(successResponse);

    } catch (error) {
        const apiErrorResponse = new ApiErrorResponse( StatusCodes.BAD_REQUEST, error.message);
        res.status(apiErrorResponse.statusCode).json(apiErrorResponse);
    }
}
