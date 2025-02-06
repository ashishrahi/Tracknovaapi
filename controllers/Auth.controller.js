import { StatusCodes } from "http-status-codes";
import {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../utils/apiResponse/index.js";
import {
    //  Login
    loginQuery,
    RegisterQuery,
   // UserPermissions
  DeleteUserPermissionMasterQuery,
  GetUserPermissionQuery,
  AddUpdateUserPermissionMasterQuery,
  GetUserPermissionMasterQuery,
  GetUserPermissionListQuery,
  // RolePermission 
  GetRolePermissionQuery,
  AddUpdateRolePermissionMasterQuery,
  GetRolePermissionMasterQuery,
  // RoleMaster
  GetRoleMasterQuery,
  AddUpdateRoleMasterQuery,
  DeleteRoleMasterQuery,
  
} from "../utils/DBQueries/Auth.Query.js";



import jwt from "jsonwebtoken";
import AspNetUsers from "../modals/AspNetUsers.model.js";

// import { RoleMaster } from "../modals/RoleMaster.modal.js";


//--------------Register-------->
export async function Register(req, res, next){
  try {
    const model = req.body;
    const savedNewUser = await RegisterQuery(model);
    const successResponse = new ApiSuccessResponse(
      true,
      StatusCodes.CREATED,
      "User created successfully!",
      savedNewUser
    );
    res.status(successResponse.statusCode).json(successResponse);
  } catch (err) {
    const error = new Error(err.message);
    error.status = err.statusCode || StatusCodes.BAD_REQUEST;
    return next(error);
  }
}


/////////////////////////////////// Login /////////////////////////////////////////////////

export async function login(req, res, next) {
  try {
    const modal = req.body;
    const response = await loginQuery(modal, next);
    const successResponse = new ApiSuccessResponse(
      true,
      StatusCodes.OK,
      "default",
      response
    );
    // const options = {
    //   httpOnly: true,
    //   secure: true,
    // };
    return res.status(successResponse.statusCode)
    // .cookie("refreshToken", response.refreshToken, options)
    .json(successResponse);
  } catch (error) {
    const err = new Error(error.message);
    err.status = err.statusCode || StatusCodes.BAD_REQUEST;
    return next(err);
  }
}

//---------------Refresh-------->
export async function Refresh(req, res, next){
  try {
    const oldRefreshToken = req.cookies.refreshToken;
    if (!oldRefreshToken) throw new ApiErrorResponse(StatusCodes.UNAUTHORIZED, "Refresh token required");
  
    // const storedToken = await RefreshToken.findOne({ token: oldRefreshToken });
    // if (!storedToken) return res.status(403).json({ message: "Invalid refresh token" });
  
    const tokenData = jwt.verify(oldRefreshToken, process.env.REFRESH_TOKEN_SECRET)

    const user = await AspNetUsers.findOne({Id: tokenData.Id}).select("-PasswordHash");

    if (!user) {
      throw new ApiErrorResponse(StatusCodes.UNAUTHORIZED, "User not found");
    }

    const refreshToken = user.generateRefreshToken();
    const accessToken = user.generateAccessToken();


    const successResponse = new ApiSuccessResponse(
      true,
      StatusCodes.OK,
      "Token refreshed successfully", 
      { accessToken: accessToken}
      );
      const options = {
        httpOnly: true,
        secure: true,
      };
      return res.status(successResponse.statusCode).cookie("refreshToken", refreshToken, options).json(successResponse);
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      // JsonWebTokenError this errors contains actual error msg, we should avoid to provide actual error
      return next(new ApiErrorResponse(StatusCodes.UNAUTHORIZED, "Access Denied"));
  } else if(err.name === "TokenExpiredError"){
      return next(new ApiErrorResponse(StatusCodes.UNAUTHORIZED, "Refresh Token Expired, please login again"))
  } else {
      return next(err) 
  }
  }
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
      StatusCodes.BAD_REQUEST,
     error.message
    );
    res.status(errorResponse.statusCode).json(errorResponse);
  }
}

/////////////////////////////////// AddUpdate / UserPermissionMaster /////////////////////////////////////////////////

export async function AddUpdateUserPermissionMaster(req, res) {
  try {
    const modal = req.body ;   
    const { isSuccess,statusCode,message,data } = await AddUpdateUserPermissionMasterQuery(modal);

    const successResponse = new ApiSuccessResponse(
      isSuccess,
      statusCode,
      message,
      data
    );
    return res.status(successResponse.statusCode).json(successResponse);
  } catch (error) {
    const errorResponse = new ApiErrorResponse(
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
      StatusCodes.BAD_REQUEST,
      error.message
    );
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
}

////////////////////////////////////////  AddUpdate / RolePermissionMaster /////////////////////////////////////////////////

export async function AddUpdateRolePermissionMaster(req, res) {
  try {
    const modal = req.body;
    const {isSuccess,statusCode,message,data} = await AddUpdateRolePermissionMasterQuery(modal);
    const successResponse = new ApiSuccessResponse(
      isSuccess,
      statusCode,
      message,
      data
    );
    return res.status(successResponse.statusCode).json(successResponse);
  } catch (error) {
    const errorResponse = new ApiErrorResponse(
      StatusCodes.BAD_REQUEST,
      error.message
    );
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
}

////////////////////////////////////////  Get / RolePermissionMaster /////////////////////////////////////////////////

export async function GetRolePermissionMaster(req, res) {
  try {
    const modal = req.body;
    const {isSuccess,statusCode,message,data} = await GetRolePermissionMasterQuery(modal);
    const successResponse = new ApiSuccessResponse(
      isSuccess,
      statusCode,
      message,
      data
    );
    return res.status(successResponse.statusCode).json(successResponse);
  } catch (error) {
    const errorResponse = new ApiErrorResponse(
      StatusCodes.BAD_REQUEST,
      error.message
    );
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
}

////////////////////////////////////////  Get / RolePermission /////////////////////////////////////////////////

export async function GetRolePermission(req, res) {
  try {
    const modal = req.body;
    const {isSuccess,statusCode,message,data} = await GetRolePermissionQuery(modal);
    const successResponse = new ApiSuccessResponse(
      isSuccess,
      statusCode,
      message,
      data
    );
    return res.status(successResponse.statusCode).json(successResponse);
  } catch (error) {
    const errorResponse = new ApiErrorResponse(
      StatusCodes.BAD_REQUEST,
      error.message
    );
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
}

