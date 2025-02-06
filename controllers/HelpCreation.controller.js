import { StatusCodes } from "http-status-codes";
import {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../utils/apiResponse/index.js";
import {
 AddHelpCreationQuery,
 GetHelpCreationQuery,
} from "../utils/DBQueries/HelpCreation.Query.js";


////////////////////////////////////////////////// AddHelpCreationController //////////////////////////////////////////////////


export async function AddHelpCreation(req,res){
    try {
        const model = req.body;
        const { isSuccess, statusCode, message, data } = await AddHelpCreationQuery(model);
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
    }}

////////////////////////////////////////////////// GetHelpCreationController //////////////////////////////////////////////////

export async function GetHelpCreation(req,res){
    try {
        const model = req.body;
        const { isSuccess, statusCode, message, data } = await GetHelpCreationQuery(model);
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
    }}
