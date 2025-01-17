import { StatusCodes } from "http-status-codes";
import {ApiErrorResponse,ApiSuccessResponse} from "../utils/apiResponse/index.js";
import {AddUpdateBinManageQuery,GetBinManageQuery} from '../utils/DBQueries/BinManage.Query.js'

/////////////////////////////////// AddUpdateBinManage /////////////////////////////////////////////////

export async function AddUpdateBinManage(req, res) {
 try {
      
      const result = await AddUpdateBinManageQuery(model);
      const successResponse = new ApiSuccessResponse(
        true,
        StatusCodes.OK,
        'Grant Access successfully',
        result
        );
       res.status(successResponse.statusCode).json(successResponse);
       }
       catch (error) {
       const errorResponse = new ApiErrorResponse(false,StatusCodes.OK, 'Failed to grant Access Permission');
       res.status(errorResponse.statusCode).json(errorResponse);
       }}


/////////////////////////////////// GetBinManage /////////////////////////////////////////////////


export async function GetBinManage(req, res) {
   try {
        const {result, rowCount} = await GetBinManageQuery(req.query);
        const successResponse = new ApiSuccessResponse(
          true,
          StatusCodes.OK,
          'Grant Access successfully',
          result,
          );
         res.status(successResponse.statusCode).json({successResponse,rowCount});
         }
         catch (error) {
         const errorResponse = new ApiErrorResponse(false,StatusCodes.NOT_FOUND, 'Failed to grant Access Permission');
         res.status(errorResponse.statusCode).json(errorResponse);
         }
        }