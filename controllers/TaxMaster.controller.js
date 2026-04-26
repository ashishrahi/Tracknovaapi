import { StatusCodes } from "http-status-codes";
import { ApiErrorResponse, ApiSuccessResponse } from "../utils/apiResponse/index.js";
import {
    AddUpdateTaxMasterQuery,
    ImportTaxMastersQuery,
    GetTaxMasterQuery,
    DeleteTaxMasterQuery,
} from "../utils/DBQueries/TaxMaster.Query.js";

///////////////////////////////////////////////////  AddUpdateTaxMaster  ////////////////////////////////////////////////////////

export async function AddUpdateTaxMaster(req,res){
    try {
        const model = req.body;
        const { isSuccess, internalSuccess, mesg , insertedId, data } = await AddUpdateTaxMasterQuery(model);
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

///////////////////////////////////////////////////  ImportTaxMasters  ////////////////////////////////////////////////////////

export async function ImportTaxMasters(req,res){
    try {
        const model = req.body;
        const { isSuccess, internalSuccess, mesg , insertedId, data } = await ImportTaxMastersQuery(model);
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



//////////////////////////////////////////////////////  GetTaxMaster  ////////////////////////////////////////////////////////

export async function GetTaxMaster(req,res){
    try {
        const model = req.body;
        const { isSuccess, internalSuccess, mesg , insertedId, data} = await GetTaxMasterQuery(model);
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

///////////////////////////////////////////////////// DeleteTaxMaster ////////////////////////////////////////////////////////

export async function DeleteTaxMaster(req,res){
    try {
        const model = req.body;
        const {isSuccess, internalSuccess, mesg , insertedId, data} = await DeleteTaxMasterQuery(model);
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
