import { StatusCodes } from "http-status-codes";
import {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../utils/apiResponse/index.js";
import {
  AddUpdateBinManageQuery,
  GetBinManageQuery,
} from "../utils/DBQueries/BinManage.Query.js";

/////////////////////////////////// AddUpdateBinManage /////////////////////////////////////////////////

export async function AddUpdateBinManage(req, res) {
  try {
    const model = req.body;
    const { isSuccess, statusCode, message, data } =
      await AddUpdateBinManageQuery(model);
    console.log(data);
    const successResponse = new ApiSuccessResponse(
      isSuccess,
      statusCode,
      message,
      data
    );
    res.status(successResponse.statusCode).json(successResponse);
  } catch (error) {
    const errorResponse = new ApiErrorResponse(
      StatusCodes.INTERNAL_SERVER_ERROR,
     error.message
    );
    res.status(errorResponse.statusCode).json(errorResponse);
  }
}

/////////////////////////////////// GetBinManage /////////////////////////////////////////////////

export async function GetBinManage(req, res) {
  try {
    const model = req.body;

    const { isSuccess, statusCode, message, data, pageNo, pageSize, rowCount } =
      await GetBinManageQuery(model);
    const successResponse = new ApiSuccessResponse(
      isSuccess,
      statusCode,
      message,
      data,
      pageNo,
      pageSize,
      rowCount
    );
    res.status(successResponse.statusCode).json({ successResponse });
  } catch (error) {
    const errorResponse = new ApiErrorResponse(
      StatusCodes.BAD_REQUEST,
      error.message
    );
    res.status(errorResponse.statusCode).json(errorResponse);
  }
}
