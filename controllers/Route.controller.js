import { StatusCodes } from "http-status-codes";
import {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../utils/apiResponse/index.js";
import {
    AddUpdateRoutesQuery,
    GetRoutesQuery,
    DeleteRoutesQuery,
} from "../utils/DBQueries/Routes.Query.js";




////////////////////////////////////////////////// AddUpdateRoutes //////////////////////////////////////////////////////////

export async function AddUpdateRoutes(req,res){
    try {
        const model = req.body;
        const { isSuccess, statusCode, message, data } = await AddUpdateRoutesQuery(model);
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

////////////////////////////////////////////// GetRoutes //////////////////////////////////////////////////////////////////////////

export async function GetRoutes(req,res){
    try {
        const model = req.body;
        const { isSuccess, statusCode, message, data,pageNo,pageSize,rowCount } = await GetRoutesQuery(model);
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

//////////////////////////////////////////// DeleteRoutes //////////////////////////////////////////////////////////////////////////
export async function DeleteRoutes(req,res){
    try {
        const model = req.body;
        const { isSuccess, statusCode, message, data } = await DeleteRoutesQuery(model);
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
