import { StatusCodes } from "http-status-codes";
import {
  ApiErrorResponse,
  ApiSuccessResponse,
  CommonResponse,
  DBReturn,
  ReturnData
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
import EmpMaster from "../modals/EmpMaster.model.js";
import { AspNetRoles } from "../modals/AspNetRoles.modal.js";

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
    // console.log(modal)
    const { response, refreshToken} = await loginQuery(modal);
    const successResponse = new CommonResponse(
      1,
     "Login Successful",
      response,
      response.data.permissions.length
    );
    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "None", // ✅ Required for cross-site requests
    };
   
    return res.status(StatusCodes.OK)
    .cookie("refreshToken", refreshToken, options)
    .json(successResponse);
  } catch (error) {
    // console.log("error is", error)
    // const err = new Error(error.message || error.E);
    // err.status = err.statusCode || StatusCodes.BAD_REQUEST;
    return next(new ApiErrorResponse(error.StatusCode || StatusCodes.BAD_REQUEST, error.ErrorMessage || error.message));
  }
}

//---------------Refresh-------->
export async function Refresh(req, res, next){
  try {
    let response;
    const oldRefreshToken = req?.cookies?.refreshToken;
    if (!oldRefreshToken) throw new ApiErrorResponse(StatusCodes.UNAUTHORIZED, "Refresh token required");
  
    // we are not storing refreshToken inside db we used httpOnly Cookie
    // const storedToken = await RefreshToken.findOne({ token: oldRefreshToken });
    // if (!storedToken) return res.status(403).json({ message: "Invalid refresh token" });
    const tokenData = jwt.verify(oldRefreshToken, process.env.REFRESH_TOKEN_SECRET)

    const user = await AspNetUsers.findOne({Id: tokenData.Id}).select("-PasswordHash");

    if (!user) {
      throw new ApiErrorResponse(StatusCodes.UNAUTHORIZED, "User not found");
    }

    const refreshToken = user.generateRefreshToken();
    const accessToken = user.generateAccessToken();
      // const { username, password } = model;
      // console.log(model)
  
      
      // Find user by username
      // const user = await AspNetUsers.findOne({ UserName: username });
      // console.log("real user", user)
      // if (!user) {
      //     throw new ApiErrorResponse(StatusCodes.UNAUTHORIZED, "Invalid Username or Password");
      // }
  
      // Check password
      // const isPasswordValid = await user.isValidPassword(password);
      // console.log("isPasswordValid: ",isPasswordValid)
      // if (!isPasswordValid) {
      //   return next(new ApiErrorResponse(StatusCodes.UNAUTHORIZED, "Invalid Username or Password"));
      // }
      
      // AspUser => EmpMaster => RoleId
      const empRoleId = await EmpMaster.findOne({UserId: user.Id}).select("RoleId").lean();
      // console.log("empROleid", empRoleId)
      // // Fetch user roles
      const roles = await AspNetRoles.find(
        { Id: 
          { $in: 
          [empRoleId.RoleId]
          // ["82763a68-4d8d-4358-96a5-c2d2981e3d0a"]
         // emp.RoleId
  
         } }
      ).lean();
      // console.log("roles: ", roles)
      const rolesString = roles.map(role => role.Name)
      // console.log("rolesString", rolesString)
      // return rolesString;
  
      // Fetch user permissions
      // const userPermissions = await UserPermission.find({UserId: user.Id}).lean();
      // console.log("userPermissions: ", userPermissions)
      // if (!userPermissions) {
      //     return next(StatusCodes.BAD_REQUEST, "Failed to fetch user permissions");
      // }
  
      const userPermissions = await  GetUserPermissionMasterQuery({userId: user.Id
        // user.Id
      })
      // console.log("user permission:", userPermissions)
      if (!userPermissions) {
        throw new ApiErrorResponse(StatusCodes.BAD_REQUEST, "Failed to fetch user permissions");
      }
  
      // Generate JWT Token
      const authClaims = {
        id: user.Id,
        username: user.UserName,
        roles: rolesString,
      };
      // console.log(userPermissions);
      // const token = jwt.sign(authClaims, process.env.ACCESS_TOKEN_SECRET, {
      //     expiresIn: "5y", // Token expires in 5 years
      // });
     
      response = {
          // status: 1,
        // message: "Login Successful",
        
        // message: "Login Successful",
        
        token: accessToken, // user.generateAccessToken(),
        expiration: Number(process.env.ACCESS_TOKEN_EXPIRY)/1000, // 5 years
        isSuccess: true,
        message: "Login Successful",
        data: {
          userDetail: {
            id: user.Id,
            userName: user.UserName,
            email: user.Email,
            phoneNumber: user.PhoneNumber,
            roles:  rolesString, // ["User"]//
          },
          permissions:  userPermissions?.data //formattedData(userPermissions),
        }
      };

    
      
    const successResponse = new CommonResponse(
      1,
      "login successful",
      response
      );

      const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None", // ✅ Required for cross-site requests
      };

      return res.status(StatusCodes.OK).cookie("refreshToken", refreshToken, options).json(successResponse);
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

//------------Logout---------->
export async function Logout(req, res, next){
  res.clearCookie("refreshToken");
  return res.status(StatusCodes.OK).json(new CommonResponse(1, "User loggedOut Successfully"))
}

//-------------GetUSER---------->
export async function GetUSER(req, res){
 try {
   const user = req.user;
   if(!user){
     return res.status(StatusCodes.BAD_REQUEST).json(new ApiErrorResponse(StatusCodes.BAD_REQUEST, "Please login or create acount first."))
   }
   const userFullDetails = await EmpMaster.findOne({UserId: user.Id})
   .select("-ImageFile -SignatureFile")
   .lean();
 
   return res.status(StatusCodes.OK).json(new ApiSuccessResponse(true, StatusCodes.OK, "default", userFullDetails))
 
 } catch (error) {
    const statusCode = error.StatusCode;
    const msg = error.ErrorMessage || error.message;
    throw new ApiErrorResponse(statusCode, msg);
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
    const {isSuccess, id, createUpdate, msg, data} = await AddUpdateUserPermissionMasterQuery(modal);

    const successResponse = new DBReturn(
      isSuccess,
      id,
      createUpdate,
      msg,
      data
    );
    return res.status(StatusCodes.CREATED).json(successResponse);
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
    const {isSuccess, id, createUpdate, msg, data} = await GetUserPermissionMasterQuery(modal);
    const successResponse = new DBReturn(
      isSuccess,
      id,
      createUpdate,
      msg,
      data
    );
    return res.status(StatusCodes.OK).json(successResponse);
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
    const rtd = await AddUpdateRoleMasterQuery(modal);
    const successResponse = new ReturnData(
      rtd.isSuccess,
      rtd.isSuccess,
      rtd.mesg,
    );
    const code = rtd.mesg === "Successfully Updated" ? StatusCodes.OK : StatusCodes.CREATED
    return res.status(code).json(successResponse);
  } catch (error) {
    throw new ApiErrorResponse(error.StatusCode, error.ErrorMessage || error.message)
  }
}

////////////////////////////////////////   Get / RoleMaster  /////////////////////////////////////////////////

export async function GetRoleMaster(req, res) {
  try {
    const {status, message, data} = await GetRoleMasterQuery();


    const successResponse = new CommonResponse(
      status,
      message,
      data,
    );
    return res.status(StatusCodes.OK).json(successResponse);
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

    const {status, message, data} = await DeleteRoleMasterQuery(modal);
    const successResponse = new ApiSuccessResponse(
      status,
      message,
      data
    );
    return res.status(StatusCodes.OK).json(successResponse);
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
    const {isSuccess, internalSuccess, mesg, insertedId, data} = await AddUpdateRolePermissionMasterQuery(modal);
    const successResponse = new ReturnData(
      isSuccess,
      internalSuccess,
      mesg,
      insertedId,
      data
    );
    return res.status(StatusCodes.CREATED).json(successResponse);
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
    const modal = req.query;
    const {isSuccess, internalSuccess, mesg, insertedId, data} = await GetRolePermissionMasterQuery(modal);
    const successResponse = new ReturnData(
      isSuccess,
      internalSuccess,
      mesg,
      insertedId,
      data
    );
    return res.status(StatusCodes.OK).json(successResponse);
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
    const modal  = req.query;
    const { status, message, data, rowCount } = await GetRolePermissionQuery(modal);
    const successResponse = new CommonResponse(
      status,
      message,
      data,
      rowCount
    );
    return res.status(StatusCodes.OK).json(successResponse);
  } catch (error) {
    const errorResponse = new ApiErrorResponse(
      error.StatusCode || error.statusCode ,
      error.message || error.ErrorMessage
    );
    return res.status(errorResponse.StatusCode).json(errorResponse);
  }
}

