import { StatusCodes } from "http-status-codes";
import { ApiErrorResponse, ApiSuccessResponse } from "../utils/apiResponse/index.js";
import {
    AddUpdateRosterPlanQuery,
    GetRosterPlanQuery,
    DeleteRosterPlanQuery,
} from "../utils/DBQueries/RosterPlan.Query.js";

////////////////////////////////////////////////// AddUpdateRosterPlan //////////////////////////////////////////////////////////

export async function AddUpdateRosterPlan(req,res){
    try {
        const model = req.body;
        const { status, message, data } = await AddUpdateRosterPlanQuery(model);
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


/////////////////////////////////////////////// GetRosterPlan //////////////////////////////////////////////////////////

export async function GetRosterPlan(req,res){
    try {
        const model = req.body;
        const { status, message, data,  rowCount, pageNo, pageSize} = await GetRosterPlanQuery(model);
        const successResponse = ApiSuccessResponse.common(
            status,
            message,
            data,
            rowCount,
            pageNo,
            pageSize
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
        const { isSuccess, internalSuccess, mesg, insertedId } = await DeleteRosterPlanQuery(model);
        const successResponse = ApiSuccessResponse.returnData(
            isSuccess,
            internalSuccess,
            mesg,
            insertedId
        );
        res.status(StatusCodes.OK).json(successResponse);

    } catch (error) {
        const apiErrorResponse = new ApiErrorResponse(false, StatusCodes.BAD_REQUEST, error.message);
        res.status(apiErrorResponse.statusCode).json(apiErrorResponse);
    }
}