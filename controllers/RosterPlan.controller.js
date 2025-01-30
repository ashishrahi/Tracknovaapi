import { StatusCodes } from "http-status-codes";
import {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../utils/apiResponse/index.js";
import {
    AddUpdateRosterPlanQuery,
    GetRosterPlanQuery,
    DeleteRosterPlanQuery,
} from "../utils/DBQueries/RosterPlan.Query.js";

////////////////////////////////////////////////// AddUpdateRosterPlan //////////////////////////////////////////////////////////

export async function AddUpdateRosterPlan(req,res){
    try {
        const model = req.body;
        const { isSuccess, statusCode, message, data } = await AddUpdateRosterPlanQuery(model);
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


/////////////////////////////////////////////// GetRosterPlan //////////////////////////////////////////////////////////

export async function GetRosterPlan(req,res){
    try {
        const model = req.body;
        const { isSuccess, statusCode, message, data } = await GetRosterPlanQuery(model);
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



////////////////////////////////////////////// DeleteRosterPlan //////////////////////////////////////////////////////////

export async function DeleteRosterPlan(req,res){
    try {
        const model = req.body;
        const { isSuccess, statusCode, message, data } = await DeleteRosterPlanQuery(model);
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