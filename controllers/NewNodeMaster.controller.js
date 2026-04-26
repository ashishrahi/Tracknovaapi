import { StatusCodes } from "http-status-codes";
import { ApiErrorResponse, ApiSuccessResponse } from "../utils/apiResponse/index.js";
import {
    AddUpdateNewNodeMasterQuery,
    GetAllNodesQuery,
    DeleteNodeQuery
} from "../utils/DBQueries/NewNodes.Query.js";




async function AddUpdateNewNodeMaster(req, res){
    try {
        const modal = req.body;
        const { status, message, data, } = await AddUpdateNewNodeMasterQuery(modal);
        const successResponse = ApiSuccessResponse.common(
            status,
            message,
            data,
        );
        res.status(StatusCodes.OK).json(successResponse);

    } catch (error) {
        const apiErrorResponse = new ApiErrorResponse(
            false, 
            StatusCodes.BAD_REQUEST,
             error.message);
        res.status(apiErrorResponse.StatusCode).json(apiErrorResponse);
    }
}

///////////////////////////////////////////////// GetAllNodes //////////////////////////////////////////////////////////
export async function GetAllNodes(req,res){
    try {
        const modal = req.body;
        const { status, message, data, } = await GetAllNodesQuery(modal);
        const successResponse = ApiSuccessResponse.common(
            status,
            message,
            data,
        );
        res.status(StatusCodes.OK).json(successResponse);

    } catch (error) {
        const apiErrorResponse = new ApiErrorResponse(
            false, 
            StatusCodes.BAD_REQUEST,
             error.message);
        res.status(apiErrorResponse.StatusCode).json(apiErrorResponse);
    }
}

///////////////////////////////////////////////// DeleteNode //////////////////////////////////////////////////////
export async function DeleteNode(req,res){
    try {
        const modal = req.body;
        const { status, message, data, } = await DeleteNodeQuery(modal);
        const successResponse = ApiSuccessResponse.common(
            status,
            message,
            data,
        );
        res.status(StatusCodes.OK).json(successResponse);

    } catch (error) {
        const apiErrorResponse = new ApiErrorResponse(
            false, 
            StatusCodes.BAD_REQUEST,
             error.message);
        res.status(apiErrorResponse.StatusCode).json(apiErrorResponse);
    }
}





export { AddUpdateNewNodeMaster };