import { StatusCodes } from "http-status-codes";
import { ApiErrorResponse, ApiSuccessResponse } from "../utils/apiResponse/index.js";
import {
    AddUpdateRoutesQuery,
    GetRoutesQuery,
    DeleteRoutesQuery,
} from "../utils/DBQueries/Routes.Query.js";




////////////////////////////////////////////////// AddUpdateRoutes //////////////////////////////////////////////////////////

export async function AddUpdateRoutes(req,res){
    try {
        const model = req.body;
        const { status, message, data, } = await AddUpdateRoutesQuery(model);
        const successResponse = ApiSuccessResponse.common(
            status,
            message,
            data,
        );
        res.status(StatusCodes.CREATED).json(successResponse);

    } catch (error) {
        const apiErrorResponse = new ApiErrorResponse(
             StatusCodes.BAD_REQUEST,
            error.message);
        res.status(apiErrorResponse.statusCode).json(apiErrorResponse);
    }
}

////////////////////////////////////////////// GetRoutes //////////////////////////////////////////////////////////////////////////

export async function GetRoutes(req,res){
    try {
        const model = req.body;
        const { status, message, data,pageNo,pageSize,totalCount } = await GetRoutesQuery(model);
        const successResponse = ApiSuccessResponse.common(
            status,
            message,
            data,
            pageNo,
            pageSize,
            totalCount,
          
        );
        res.status(StatusCodes.OK).json(successResponse);

    } catch (error) {
        const apiErrorResponse = new ApiErrorResponse(
            StatusCodes.BAD_REQUEST, 
            error.message);
        res.status(apiErrorResponse.statusCode).json(apiErrorResponse);
    }
}

//////////////////////////////////////////// DeleteRoutes //////////////////////////////////////////////////////////////////////////
export async function DeleteRoutes(req,res){
    try {
        const model = req.body;
        const { status, message, data,} = await DeleteRoutesQuery(model);
        const successResponse = ApiSuccessResponse.common(
            status,
            message,
            data,
        );
        res.status(StatusCodes.OK).json(successResponse);

    } catch (error) {
        const apiErrorResponse = new ApiErrorResponse(
            StatusCodes.BAD_REQUEST, 
            error.message);
        res.status(apiErrorResponse.statusCode).json(apiErrorResponse);
    }
}
