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
    const { userId, roleId } = req.body;
    console.log(userId);

    const result = await GetUserPermissionQuery(userId, roleId);
    const successResponse = new ApiSuccessResponse(
      true,
      StatusCodes.OK,
      "Grant Access successfully",
      result
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
    const { userId, userPermission } = req.body;
    if (!userId || userId.trim() === "") {
      const errorResponse = new ApiErrorResponse(
        false,
        StatusCodes.NOT_FOUND,
        "User Id is required"
      );
      return res.status(errorResponse.statusCode).json(errorResponse);
    }

    const result = await AddUpdateUserPermissionMasterQuery(
      userId,
      userPermission
    );

    console.log(result);
    const successResponse = new ApiSuccessResponse(
      true,
      StatusCodes.OK,
      "Grant Access successfully",
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

////////////////////////////////////////  GetUser / PermissionMaster  /////////////////////////////////////////////////

export async function GetUserPermissionMaster(req, res) {
  try {
    const { UserId } = req.body;
    const result = await GetUserPermissionMasterQuery(UserId);
    console.log(result);
    const successResponse = new ApiSuccessResponse(
      true,
      StatusCodes.OK,
      "Grant Access successfully",
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

//////////////////////////////////////// GetUser / PermissionList /////////////////////////////////////////////////

export async function GetUserPermissionList(req, res) {
  try {
    const { UserId } = req.body;
    const result = await GetUserPermissionListQuery(UserId);
    const successResponse = new ApiSuccessResponse(
      true,
      StatusCodes.OK,
      "Grant Access successfully",
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

//////////////////////////////////////// DeleteUser / PermissionMaster /////////////////////////////////////////////////

export async function DeleteUserPermissionMaster(req, res) {
  try {
    const { userId } = req.params;
    console.log(userId);

    const result = await DeleteUserPermissionMasterQuery(userId);
    const successResponse = new ApiSuccessResponse(
      true,
      StatusCodes.OK,
      "Delete successfully",
      result
    );
    return res.status(successResponse.statusCode).json(successResponse);
  } catch (error) {
    const errorResponse = new ApiErrorResponse(
      false,
      StatusCodes.NOT_FOUND,
      "Failed to grant Access Permission to Delete",
      error.message
    );
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
}

//////////////////////////////////////// AddUpdate / RoleMaster /////////////////////////////////////////////////

export async function AddUpdateRoleMaster(req, res) {
  try {
    const result = await AddUpdateRoleMasterQuery();
    const successResponse = new ApiSuccessResponse(
      true,
      StatusCodes.OK,
      "Update successfully",
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

////////////////////////////////////////   Get / RoleMaster  /////////////////////////////////////////////////

export async function GetRoleMaster(req, res) {
  try {
    const roles = await RoleMaster.find().exec();

    const successResponse = new ApiSuccessResponse(
      true,
      StatusCodes.OK,
      "Grant Access successfully",
      roles
    );
    return res.status(successResponse.statusCode).json(successResponse);
  } catch (err) {
    const errorResponse = new ApiErrorResponse(
      false,
      StatusCodes.NOT_FOUND,
      "Failed to grant Access Permission",
      error.message
    );
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
}

////////////////////////////////////////   Delete / RoleMaster /////////////////////////////////////////////////

export async function DeleteRoleMaster(req, res) {
  try {
    const { roleId } = req.params;

    const result = await DeleteRoleMasterQuery(roleId);
    const successResponse = new ApiSuccessResponse(
      true,
      StatusCodes.OK,
      "Deleted successfully",
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

////////////////////////////////////////  AddUpdate / RolePermissionMaster /////////////////////////////////////////////////

export async function AddUpdateRolePermissionMaster(req, res) {
  try {
    const result = await AddUpdateRolePermissionMasterQuery(req.body);
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
    const { roleId } = req.query;
    const result = await GetRolePermissionMasterQuery(roleId);
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
    const { roleId } = req.query;

    const result = await GetRolePermissionQuery(roleId);
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
