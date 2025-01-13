import { StatusCodes } from "http-status-codes";
import {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../utils/apiResponse/index.js";
import {GetUserPermissionQuery,AddUpdateUserPermissionMasterQuery} from '../utils/DBQueries/Auth.Query.js'

/////////////////////////////////// User_Login /////////////////////////////////////////////////


export async function login(req, res) {
const {USER_ID,PASSWORD} = req.body;
try {
    
if(!USER_ID){
    response.mesg = "Please Enter UserID"
    return res.status(400).json(response)
}
if(!PASSWORD){
    response.mesg = "Please Enter Password"
    return res.status(400).json(response)
}
} catch (error) {
}
}

/////////////////////////////////// GetUserPermissions /////////////////////////////////////////////////

export async function GetUserPermissions(req, res) {
      try {
      const { userId } = req.body; 
      console.log(userId)
      
      const result = await GetUserPermissionQuery(userId);
      const successResponse = new ApiSuccessResponse(
        true,
        200,
        'Grant Access successfully',
        result
        );
       res.status(successResponse.statusCode).json(successResponse);
       }
       catch (error) {
       const errorResponse = new ApiErrorResponse(false, 500, 'Failed to grant Access Permission');
       res.status(errorResponse.statusCode).json(errorResponse);
       }}


/////////////////////////////////// AddUpdateUserPermissionMaster /////////////////////////////////////////////////

export async function AddUpdateUserPermissionMaster(req, res) {
  try {
    const { userId, userPermission } = req.body;
    console.log(req.body)
    if (!userId || userId.trim() === "") {
      const errorResponse = new ApiErrorResponse(
        false,
        400,
        "User Id is required"
      );
      return res.status(errorResponse.statusCode).json(errorResponse);
    }

    const result = await AddUpdateUserPermissionMasterQuery(userId, userPermission);
   
console.log(result)
    const successResponse = new ApiSuccessResponse(
      true,
      200,
      "Grant Access successfully",
      result
    );
    return res.status(successResponse.statusCode).json(successResponse);
    } 
    catch (error) {
    const errorResponse = new ApiErrorResponse(
      false,
      500,
      "Failed to grant Access Permission",
      error.message 
    );
    return res.status(errorResponse.statusCode).json(errorResponse);
    }}


  ////////////////////////////////////////  GetUserPermissionMaster  /////////////////////////////////////////////////


 export async function GetUserPermissionMaster(req, res) {
  try {
   
    const result = await GetUserPermissionMasterQuery();

    // Success response
    const successResponse = new ApiSuccessResponse(
      true,
      200,
      "Grant Access successfully",
      result
    );
    return res.status(successResponse.statusCode).json(successResponse);
  } catch (error) {
    // Error response
    const errorResponse = new ApiErrorResponse(
      false,
      500,
      "Failed to grant Access Permission",
      error.message
    );
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
}
