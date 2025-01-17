import { StatusCodes } from "http-status-codes";
import {ApiErrorResponse, ApiSuccessResponse} from "../utils/apiResponse/index.js";
import {AddUpdateBinLocationQuery,GetBinLocationQuery,DeleteBinLocationQuery} from '../utils/DBQueries/BinLocation.Query.js'

////////////////////////////////////////////// AddUpdateBinLocation /////////////////////////////////////////////////////////

export async function AddUpdateBinLocation(req, res) {
      try {
        const result = await AddUpdateBinLocationQuery(req.body);
        const successResponse = new ApiSuccessResponse(
        true,
        StatusCodes.OK,
        'Grant Access successfully',
        result
        );
        res.status(successResponse.statusCode).json(successResponse);
        }
        catch (error) {
        const errorResponse = new ApiErrorResponse(false, StatusCodes.NOT_FOUND, 'Failed to grant Access Permission');
        res.status(errorResponse.statusCode).json(errorResponse);
        }}

/////////////////////////////////// GetBinLocation /////////////////////////////////////////////////

export async function GetBinLocation(req, res) {
    try {
    const result = await GetBinLocationQuery();
    const successResponse = new ApiSuccessResponse(
      true,
      StatusCodes.OK,
      'Fetch successfully',
      result
      );
     res.status(successResponse.statusCode).json(successResponse);
     }
     catch (error) {
     const errorResponse = new ApiErrorResponse(false, StatusCodes.NOT_FOUND, 'Failed to grant Access Permission');
     res.status(errorResponse.statusCode).json(errorResponse);
     }}


/////////////////////////////////// DeleteBinLocation /////////////////////////////////////////////////

export async function DeleteBinLocation(req, res) {
    try {
    const result = await DeleteBinLocationQuery(req.query);
    const successResponse = new ApiSuccessResponse(
      true,
      StatusCodes.OK,
      'Grant Access successfully',
      result
      );
     res.status(successResponse.statusCode).json(successResponse);
     }
     catch (error) {
     const errorResponse = new ApiErrorResponse(false, StatusCodes.NOT_FOUND, 'Failed to grant Access Permission');
     res.status(errorResponse.statusCode).json(errorResponse);
     }}
