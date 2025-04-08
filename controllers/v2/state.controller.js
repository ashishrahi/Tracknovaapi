import { StatusCodes } from "http-status-codes";
import { v2StateService } from "../../services/index.js";
import { ApiErrorResponse, ReturnData } from "../../utils/apiResponse/index.js";

// addState
export async function addState(req, res) {
  try {
    const model = req.body;

    const {  isSuccess, internalSuccess, mesg, insertedId, data } = await v2StateService.addState(model);
    const successResponse = new ReturnData(
      isSuccess,
      internalSuccess,
      mesg,
      insertedId,
      data
    );
    res.status(StatusCodes.OK).json(successResponse);
  } catch (error) {
    const errorResponse = new ApiErrorResponse(
      StatusCodes.BAD_REQUEST,
      error.message
    );
    res.status(errorResponse.StatusCode).json(errorResponse);
  }
}

// getState
export async function getState(req, res) {
    try {
      const { countryId } = req.query;
      // console.log("req.query", req.params)
      // return res.json(req.query)
  
      const {  isSuccess, internalSuccess, mesg, insertedId, data } =
        await v2StateService.getStatebyCountry(countryId);
      const successResponse = new ReturnData(
        isSuccess,
        internalSuccess,
        mesg,
        insertedId,
        data
      );
      res.status(StatusCodes.OK).json(successResponse);
    } catch (error) {
      const errorResponse = new ApiErrorResponse(
        StatusCodes.BAD_REQUEST,
        error.message
      );
      res.status(errorResponse.StatusCode).json(errorResponse);
    }
}

// stateList
export async function stateList(req, res) {

   try {
          const model = req.body;
          const { isSuccess, internalSuccess, mesg, insertedId, data} = await v2StateService.stateList(model);
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
          res.status(apiErrorResponse.StatusCode).json(apiErrorResponse);
      }
  
}

// deleteList

export async function deleteState(req, res) {

  try {
         const model = req.body;
         const { isSuccess, internalSuccess, mesg, insertedId, data} = await v2StateService.deleteState(model);
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
         res.status(apiErrorResponse.StatusCode).json(apiErrorResponse);
     }
 
}