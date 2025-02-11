import { StatusCodes } from "http-status-codes";
import {
  ApiErrorResponse,
  CommonResponse,
} from "../utils/apiResponse/index.js";
import {
 AddUpdatePetrolPumpQuery,
 GetPetrolPumpVehicleQuery,
 GetPetrolPumpQuery,
 DeletePetrolPumpQuery,
} from "../utils/DBQueries/Petrol_Pump_tbl.Query.js";

////////////////////////////////////////////////// AddUpdatePetrolPump ////////////////////////////////////////////// 

export async function AddUpdatePetrolPump(req,res){
    try {
        const model = req.body;
        const { status, message, data } = await AddUpdatePetrolPumpQuery(model);
        const successResponse = new CommonResponse(
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

//////////////////////////////////////////////////  GetPetrolPumpVehicle ///////////////////////////////////////////

export async function GetPetrolPumpVehicle(req,res){
    try {
        const model = req.body;
        const { status, message, data } = await GetPetrolPumpVehicleQuery(model);
        const successResponse = new CommonResponse(
            status,
            message,
            data,
        );
        res.status(StatusCodes.OK).json(successResponse);

    } catch (error) {
        const apiErrorResponse = new ApiErrorResponse(
            StatusCodes.BAD_REQUEST, 
            error.message);
        res.status(apiErrorResponse.statusCode).json(apiErrorResponse);
    }
}


//////////////////////////////////////////////////// GetPetrolPump //////////////////////////////////////////////////////////////////

export async function GetPetrolPump(req,res){
    try {
        const model = req.body;
        const { status, message, data } = await GetPetrolPumpQuery(model);
        const successResponse = new CommonResponse(
            status,
            message,
            data,
        );
        res.status(StatusCodes.OK).json(successResponse);

    } catch (error) {
        const apiErrorResponse = new ApiErrorResponse(
             StatusCodes.BAD_REQUEST, 
             error.message);
        res.status(apiErrorResponse.statusCode).json(apiErrorResponse);
    }
}



//////////////////////////////////////////////////// DeletePetrolPump //////////////////////////////////////////////////////////////////
export async function DeletePetrolPump(req,res){
    try {
        const model = req.body;
        const { status, message, data} = await DeletePetrolPumpQuery(model);
        const successResponse = new CommonResponse(
            status,
            message,
            data,
        );
        res.status(StatusCodes.OK).json(successResponse);

    } catch (error) {
        const apiErrorResponse = new ApiErrorResponse(
            StatusCodes.BAD_REQUEST, 
            error.message);
        res.status(apiErrorResponse.statusCode).json(apiErrorResponse);
    }
}