import { StatusCodes } from "http-status-codes";
import { ApiErrorResponse, ApiSuccessResponse } from "../utils/apiResponse/index.js";
import {
    AddUpdateUnitMasterQuery,
    ImportUnitsQuery,
    GetUnitMasterQuery,
    DeleteUnitMasterQuery
} from "../utils/DBQueries/UnitMaster.Query.js";

//////////////////////////////////////// AddUpdateUnitMaster //////////////////////////////////////////
export async function AddUpdateUnitMaster(req,res){
    try {
        const modal = req.body;
        const {isSuccess, internalSuccess, mesg, insertedId, data } = await AddUpdateUnitMasterQuery(modal);
        const successResponse = ApiSuccessResponse.returnData(
            isSuccess,
            internalSuccess,
            mesg,
            insertedId,
            data
        );
        res.status(StatusCodes.CREATED).json(successResponse);

    } catch (error) {
        const apiErrorResponse = new ApiErrorResponse(
            StatusCodes.BAD_REQUEST, 
            error.message);
        res.status(apiErrorResponse.statusCode).json(apiErrorResponse);
    }
}

//////////////////////////////////////// ImportUnits //////////////////////////////////////////

export async function ImportUnits(req,res){
    try {
        const modal = req.body;
        const {isSuccess, internalSuccess, mesg, insertedId, data } = await ImportUnitsQuery(modal);
        const successResponse = ApiSuccessResponse.returnData(
            isSuccess,
            internalSuccess,
            mesg,
            insertedId,
            data
        );
        res.status(StatusCodes.CREATED).json(successResponse);

    } catch (error) {
        const apiErrorResponse = new ApiErrorResponse(
            StatusCodes.BAD_REQUEST, 
            error.message);
        res.status(apiErrorResponse.StatusCode).json(apiErrorResponse);
    }
}



//////////////////////////////////////// GetUnitMaster //////////////////////////////////////////

export async function GetUnitMaster(req,res){
    try {
        const modal = req.body;
        const { isSuccess, internalSuccess, mesg, insertedId, data} = await GetUnitMasterQuery(modal);
        const successResponse = ApiSuccessResponse.returnData(
            isSuccess,
            internalSuccess,
            mesg,
            insertedId,
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

//////////////////////////////////////// DeleteUnitMaster //////////////////////////////////////////

export async function DeleteUnitMaster(req,res){
    try {
        const modal = req.body;
        console.log('modal',modal)
        const { isSuccess, internalSuccess, mesg, insertedId, data } = await DeleteUnitMasterQuery(modal);
        const successResponse = ApiSuccessResponse.returnData(
            isSuccess,
            internalSuccess,
            mesg,
            insertedId,
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
