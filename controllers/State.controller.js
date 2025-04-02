import { StatusCodes } from "http-status-codes";
import { ApiErrorResponse,ReturnData} from "../utils/apiResponse/index.js";
import {
    AddUpdateStateQuery,
    GetStateQuery,
    GetStatebyCountryQuery,
    DeleteStateQuery,
} from "../utils/DBQueries/State.Query.js";

//////////////////////////////////////////////// AddUpdateState //////////////////////////////////////////////////////////////////
export async function AddUpdateState(req,res){
    try {
        const model = req.body;
        const { isSuccess, internalSuccess, mesg, insertedId, data} = await AddUpdateStateQuery(model);
        const successResponse = new ReturnData(
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

//////////////////////////////////////////////// GetStatebyCountry //////////////////////////////////////////////////////////////////
export async function GetStatebyCountry(req,res){
    try {
        const model = req.params;
        // console.log("model:",model)
        const { isSuccess, internalSuccess, mesg, insertedId, data} = await GetStatebyCountryQuery(model);
        const successResponse = new ReturnData(
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


/////////////////////////////////////////////////// GetState //////////////////////////////////////////////////////////////////


export async function GetState(req,res){
    try {
        const model = req.body;
        const { isSuccess, internalSuccess, mesg, insertedId, data} = await GetStateQuery(model);
        const successResponse = new ReturnData(
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

//////////////////////////////////////////////////// DeleteState //////////////////////////////////////////////////////////////////

export async function DeleteState(req,res){
    try {
        const model = req.body;
        const { isSuccess, internalSuccess, mesg, insertedId, data } = await DeleteStateQuery(model);
        const successResponse = new ReturnData(
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