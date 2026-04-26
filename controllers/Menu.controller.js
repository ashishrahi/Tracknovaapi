import { StatusCodes } from "http-status-codes";
import { ApiErrorResponse, ApiSuccessResponse } from "../utils/apiResponse/index.js";
import {
 AddUpdateMenuMasterQuery,
 GetMenuMasterQuery,
 GetParentMenuMasterQuery,
 GetChildMenuMasterQuery,
 DeleteMenuMasterQuery
} from "../utils/DBQueries/MenuMaster.Query.js";

/////////////////////// AddUpdateMenuMaster //////////////////////////////////////////////////

export async function AddUpdateMenuMaster(req,res){
    try {
        const model = req.body;
        const { isSuccess, internalSuccess, mesg, insertedId, data } = await AddUpdateMenuMasterQuery(model);
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
            false, 
            StatusCodes.BAD_REQUEST,
             error.message);
        res.status(apiErrorResponse.statusCode).json(apiErrorResponse);
    }
}

/////////////////////// GetMenuMaster //////////////////////////////////////////////////

export async function GetMenuMaster(req,res){
    try {
        const model = req.body;
        const {isSuccess, internalSuccess, mesg, insertedId, data } = await GetMenuMasterQuery(model);
        const successResponse = ApiSuccessResponse.returnData(
            isSuccess,
            internalSuccess,
            mesg,
            insertedId,
            data
        );
        res.status(StatusCodes.OK).json(successResponse);
}
    catch (error) {
        const apiErrorResponse = new ApiErrorResponse(
            StatusCodes.BAD_REQUEST,
             error.message);
        res.status(apiErrorResponse.StatusCode).json(apiErrorResponse);
    }}

    
/////////////////////// GetParentMenuMaster //////////////////////////////////////////////////

export async function GetParentMenuMaster(req,res){
    try {
        const model = req.body;
        const {isSuccess, internalSuccess, mesg, insertedId, data } = await GetParentMenuMasterQuery(model);
        const successResponse = ApiSuccessResponse.returnData(
            isSuccess,
            internalSuccess,
            mesg,
            insertedId,
            data
        );
        res.status(StatusCodes.OK).json(successResponse);
}
    catch (error) {
        const apiErrorResponse = new ApiErrorResponse(
             StatusCodes.BAD_REQUEST, 
             error.message);
        res.status(apiErrorResponse.StatusCode).json(apiErrorResponse);
    }
}

/////////////////////// GetChildMenuMaster //////////////////////////////////////////////////

export async function GetChildMenuMaster(req,res){
    try {
        const model = req.body;
        const { isSuccess, internalSuccess, mesg, insertedId, data} = await GetChildMenuMasterQuery(model);
        const successResponse = ApiSuccessResponse.returnData(
            isSuccess,
            internalSuccess,
            mesg,
            insertedId,
            data
        );
        res.status(StatusCodes.OK).json(successResponse);
}
    catch (error) {
        const apiErrorResponse = new ApiErrorResponse(
            StatusCodes.INTERNAL_SERVER_ERROR, 
            error.message);
        res.status(apiErrorResponse.StatusCode).json(apiErrorResponse);
    }}
/////////////////////// DeleteMenuMaster //////////////////////////////////////////////////

export async function DeleteMenuMaster(req,res){

    try {
        const model = req.body;
        const { isSuccess, internalSuccess, mesg, insertedId} = await DeleteMenuMasterQuery(model);
        const successResponse = ApiSuccessResponse.returnData(
            isSuccess,
            internalSuccess,
            mesg,
            insertedId
        );
        res.status(StatusCodes.OK).json(successResponse);
}
    catch (error) {
        const apiErrorResponse = new ApiErrorResponse(
             StatusCodes.BAD_REQUEST, 
             error.message);
        res.status(apiErrorResponse.StatusCode).json(apiErrorResponse);
    }}