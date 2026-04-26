import { StatusCodes } from "http-status-codes";
import { ApiErrorResponse, ApiSuccessResponse } from "../utils/apiResponse/index.js";
import {
  AddUpdateBinManageQuery,
  GetBinManageQuery,
} from "../utils/DBQueries/BinManage.Query.js";

/////////////////////////////////// AddUpdateBinManage /////////////////////////////////////////////////

export async function AddUpdateBinManage(req, res) {
  try {
    const model = req.body;
    const { status, message, data } =
      await AddUpdateBinManageQuery(model);
    const successResponse = ApiSuccessResponse.common(
      status,
      message,
      data,
    );
    res.status(StatusCodes.CREATED).json(successResponse);
  } catch (error) {
    const errorResponse = new ApiErrorResponse(
      StatusCodes.INTERNAL_SERVER_ERROR,
     error.message
    );
    res.status(errorResponse.StatusCode).json(errorResponse);
  }
}

/////////////////////////////////// GetBinManage /////////////////////////////////////////////////

export async function GetBinManage(req, res) {
  try {
    const model = req.body;

    const { status, message,data, pageNo, pageSize, rowCount } = await GetBinManageQuery(model);
    const successResponse = ApiSuccessResponse.common(
      status,
      message,
      data,
      pageNo,
      pageSize,
      rowCount
    );
    res.status(StatusCodes.OK).json( successResponse );
  } catch (error) {
    const errorResponse = new ApiErrorResponse(
      StatusCodes.BAD_REQUEST,
      error.message
    );
    res.status(errorResponse.StatusCode).json(errorResponse);
  }
}
