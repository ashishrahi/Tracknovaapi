import { StatusCodes } from "http-status-codes";
import {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../utils/apiResponse/index.js";
import {
  DeleteUserPermissionMasterQuery,
  GetUserPermissionQuery,
  AddUpdateUserPermissionMasterQuery,
  GetUserPermissionMasterQuery,
  GetUserPermissionListQuery,
  GetRolePermissionQuery,
  GetRoleMasterQuery,
  AddUpdateRoleMasterQuery,
  DeleteRoleMasterQuery,
  AddUpdateRolePermissionMasterQuery,
  GetRolePermissionMasterQuery,
} from "../utils/DBQueries/Auth.Query.js";
import { RoleMaster } from "../modals/RoleMaster.modal.js";

/////////////////////////////////// User_Login /////////////////////////////////////////////////

export async function login(req, res) {
  const { USER_ID, PASSWORD } = req.body;
  try {
    if (!USER_ID) {
      response.mesg = "Please Enter UserID";
      return res.status(400).json(response);
    }
    if (!PASSWORD) {
      response.mesg = "Please Enter Password";
      return res.status(400).json(response);
    }
  } catch (error) {}
}
/////////////////////////////////// Get / UserPermissions /////////////////////////////////////////////////

export async function GetUserPermissions(req, res) {
  try {
    const modal = req.body;
    const {isSuccess,statusCode,message,data,rowCount} = await GetUserPermissionQuery(modal);
    const successResponse = new ApiSuccessResponse(
      isSuccess,
      statusCode,
      message,
      data,
      rowCount
    );
    res.status(successResponse.statusCode).json(successResponse);
  } catch (error) {
    const errorResponse = new ApiErrorResponse(
      false,
      StatusCodes.OK,
      "Failed to grant Access Permission"
    );
    res.status(errorResponse.statusCode).json(errorResponse);
  }
}

/////////////////////////////////// AddUpdate / UserPermissionMaster /////////////////////////////////////////////////

export async function AddUpdateUserPermissionMaster(req, res) {
  try {
             const modal = req.body ;   
    const {isSuccess,statusCode,message,data} = await AddUpdateUserPermissionMasterQuery(modal);

    const successResponse = new ApiSuccessResponse(
      isSuccess,
      statusCode,
      message,
      data
    );
    return res.status(successResponse.statusCode).json(successResponse);
  } catch (error) {
    const errorResponse = new ApiErrorResponse(
      false,
      StatusCodes.BAD_REQUEST,
      error.message
    );
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
}

////////////////////////////////////////  GetUser / PermissionMaster  /////////////////////////////////////////////////

export async function GetUserPermissionMaster(req, res) {
  try {
    const modal = req.body;
    const {isSuccess,statusCode,message,data,rowCount} = await GetUserPermissionMasterQuery(modal);
    const successResponse = new ApiSuccessResponse(
      isSuccess,
      statusCode,
      message,
      data,
      rowCount
    );
    return res.status(successResponse.statusCode).json(successResponse);
  } catch (error) {
    const errorResponse = new ApiErrorResponse(
      false,
      StatusCodes.BAD_REQUEST,
      error.message
    );
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
}

//////////////////////////////////////// GetUser / PermissionList /////////////////////////////////////////////////

export async function GetUserPermissionList(req, res) {
  try {
    const modal  = req.body;
    const {isSuccess,statusCode,message,data} = await GetUserPermissionListQuery(modal);
    const successResponse = new ApiSuccessResponse(
      isSuccess,
      statusCode,
      message,
      data
    );
    return res.status(successResponse.statusCode).json(successResponse);
  } catch (error) {
    const errorResponse = new ApiErrorResponse(
      false,
      StatusCodes.BAD_REQUEST,
      error.message
    );
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
}

//////////////////////////////////////// DeleteUser / PermissionMaster /////////////////////////////////////////////////

export async function DeleteUserPermissionMaster(req, res) {
  try {
    const modal = req.body;

    const {isSuccess,statusCode,message} = await DeleteUserPermissionMasterQuery(modal);
    const successResponse = new ApiSuccessResponse(
      isSuccess,
      statusCode,
      message,
    );
    return res.status(successResponse.statusCode).json(successResponse);
  } catch (error) {
    const errorResponse = new ApiErrorResponse(
      "failed",
      StatusCodes.BAD_REQUEST,
      error.message
    );
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
}

//////////////////////////////////////// AddUpdate / RoleMaster /////////////////////////////////////////////////

export async function AddUpdateRoleMaster(req, res) {
  try {
    const modal = req.body;
    const {isSuccess,statusCode,message,data} = await AddUpdateRoleMasterQuery(modal);
    const successResponse = new ApiSuccessResponse(
      isSuccess,
      statusCode,
      message,
      data
    );
    return res.status(successResponse.statusCode).json(successResponse);
  } catch (error) {
    const errorResponse = new ApiErrorResponse(
      false,
      StatusCodes.BAD_REQUEST,
      error.message
    );
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
}

////////////////////////////////////////   Get / RoleMaster  /////////////////////////////////////////////////

export async function GetRoleMaster(req, res) {
  try {
    const {isSuccess,statusCode,message,data,rowCount} = await GetRoleMasterQuery();


    const successResponse = new ApiSuccessResponse(
      isSuccess,
      statusCode,
      message,
      data,
      rowCount
    );
    return res.status(successResponse.statusCode).json(successResponse);
  } catch (err) {
    const errorResponse = new ApiErrorResponse(
      false,
      StatusCodes.BAD_REQUEST,
      err.message
    );
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
}

////////////////////////////////////////   Delete / RoleMaster /////////////////////////////////////////////////

export async function DeleteRoleMaster(req, res) {
  try {
    const modal = req.body;

    const {isSuccess,statusCode,message} = await DeleteRoleMasterQuery(modal);
    const successResponse = new ApiSuccessResponse(
      isSuccess,
      statusCode,
      message
    );
    return res.status(successResponse.statusCode).json(successResponse);
  } catch (error) {
    const errorResponse = new ApiErrorResponse(
      false,
      StatusCodes.NOT_FOUND,
      "Failed to grant Access Permission",
      error.message
    );
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
}

////////////////////////////////////////  AddUpdate / RolePermissionMaster /////////////////////////////////////////////////

export async function AddUpdateRolePermissionMaster(req, res) {
  try {
    const modal = req.body;
    const result = await AddUpdateRolePermissionMasterQuery(modal);
    const successResponse = new ApiSuccessResponse(
      true,
      StatusCodes.OK,
      "Updated successfully",
      result
    );
    return res.status(successResponse.statusCode).json(successResponse);
  } catch (error) {
    const errorResponse = new ApiErrorResponse(
      false,
      StatusCodes.NOT_FOUND,
      "Failed to grant Access Permission",
      error.message
    );
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
}

////////////////////////////////////////  Get / RolePermissionMaster /////////////////////////////////////////////////

export async function GetRolePermissionMaster(req, res) {
  try {
    const modal = req.body;
    const result = await GetRolePermissionMasterQuery(modal);
    const successResponse = new ApiSuccessResponse(
      true,
      StatusCodes.OK,
      "Fetch successfully",
      result
    );
    return res.status(successResponse.statusCode).json(successResponse);
  } catch (error) {
    const errorResponse = new ApiErrorResponse(
      false,
      StatusCodes.NOT_FOUND,
      "Failed to grant Access Permission",
      error.message
    );
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
}

////////////////////////////////////////  Get / RolePermission /////////////////////////////////////////////////

export async function GetRolePermission(req, res) {
  try {
    const modal = req.body;

    const result = await GetRolePermissionQuery(modal);
    const successResponse = new ApiSuccessResponse(
      true,
      StatusCodes.OK,
      "Fetch successfully",
      result
    );
    return res.status(successResponse.statusCode).json(successResponse);
  } catch (error) {
    const errorResponse = new ApiErrorResponse(
      false,
      StatusCodes.NOT_FOUND,
      "Failed to grant Access Permission",
      error.message
    );
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
}
