import { StatusCodes } from "http-status-codes";
import {
  ApiErrorResponse,
  ReturnData,
} from "../utils/apiResponse/index.js";
import {
    AddUpdateStateQuery,
    GetStateQuery,
    GetStatesByCountryQuery,
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

/////////////////////////////////////////////////// GetStatesByCountry //////////////////////////////////////////////////////////////////


export async function GetStatesByCountry(req,res){
    try {
        const { CountryId }  = req.params;
        console.log("CountryId:",CountryId)
        const { isSuccess, internalSuccess, mesg, insertedId, data} = await GetStatesByCountryQuery(CountryId);
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