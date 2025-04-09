import { StatusCodes } from "http-status-codes";
// import { Company, Idp_account } from "../../modals/index.js";
import { ApiErrorResponse } from "../../utils/apiResponse/index.js";
import { authControllerResponse as apiTextResponse } from "../../utils/static-response-message/index.js"
import jwt from "jsonwebtoken";
import { getCentralDBModels, getTenantDBModels } from "../../db/index.js";
import { connectTenantDB } from "../../db/connectMongoDB.js";
import Company from "../../modals/Company.model.js";
import mongoose from "mongoose";
import { GetUserPermissionMasterQuery } from "../../utils/DBQueries/Auth.Query.js";

const ObjectId = mongoose.Types.ObjectId;


export async function signinService(value) {

  const { Idp_account, Company } = await getCentralDBModels(); // geting models
  value.username.toLowerCase();

  // fetching data from users array
  const isUserRegistered = await Idp_account.findOne({ "users.username": value.username });

  if (!isUserRegistered) {
    throw new ApiErrorResponse(StatusCodes.BAD_REQUEST, apiTextResponse.notFound);
  }
  const user = isUserRegistered?.users?.find((user) => user.username === value.username);
  // console.log("user is", user);
  const isValidPassword = await isUserRegistered.isValidPasswordForUsers(value.username, value.password);

  if (!isValidPassword) {
    throw new ApiErrorResponse(StatusCodes.UNAUTHORIZED, apiTextResponse.inValidIdp);
  }

  const companyDBDetails = await Company.findOne({ _id: isUserRegistered.accountOwner }, { database: 1 });


  if (companyDBDetails) {
    await connectTenantDB(companyDBDetails.database.dbName);
  }

  // console.log("companyDBDetails", companyDBDetails)
  /**
   * if companyDBDetails not present means SuperAdmin is logged in.
   */

  function generateRefreshToken() {
    const payload = {
      userId: user._id,
    }
    const secret = process.env.REFRESH_TOKEN_SECRET;
    const option = {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
      issuer: process.env.JWTOKEN_ISSUER_NAME
    }
    const token = jwt.sign(payload, secret, option);
    return token;
  }

  function generateAccessToken() {
    const payload = {
      ownerId: companyDBDetails?._id || "SuperAdmin",
      userId: user._id,
      username: user.username,
      email: user.email,
      // dbName: companyDBDetails?.database?.dbName || null
    }
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const option = {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      issuer: process.env.JWTOKEN_ISSUER_NAME
    }
    const token = jwt.sign(payload, secret, option);
    return token;
  }

  let navigateTo;
  isUserRegistered.users[0].role === "Admin" ? (navigateTo = "/home") : (navigateTo = "/company");

  return {
    accessToken: generateAccessToken(),
    refreshToken: generateRefreshToken(),
    role: user.role,
    username: user.username,
    navigateTo: navigateTo,
    // dbName: companyDBDetails?.database?.dbName || null
  }
}

export async function refreshService(userId) {
  try {
    console.log("userId: ", userId)
    const { Idp_account, Company } = await getCentralDBModels();

    const userDetail = await Idp_account.findOne({ "users._id": new ObjectId(userId) }, { "users.$": 1, accountOwner: 1, _id: 0 })

    console.log("user from auth service", userDetail)
    if (!userDetail) {
      throw new ApiErrorResponse(StatusCodes.UNAUTHORIZED, "User not found");
    }



    function generateRefreshToken() {
      const payload = {
        userId: userDetail.users[0]._id,
      }
      const secret = process.env.REFRESH_TOKEN_SECRET;
      const option = {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        issuer: process.env.JWTOKEN_ISSUER_NAME
      }
      const token = jwt.sign(payload, secret, option);
      return token;
    }

    function generateAccessToken() {
      const payload = {
        ownerId: userDetail.accountOwner || "SuperAdmin",
        userId: userDetail.users[0]._id,
        username: userDetail.users[0].username,
        email: userDetail.users[0].email,
      }
      const secret = process.env.ACCESS_TOKEN_SECRET;
      const option = {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        issuer: process.env.JWTOKEN_ISSUER_NAME
      }
      const token = jwt.sign(payload, secret, option);
      return token;
    }

    let response;
    const navigateTo = ["Admin", "User"].includes(userDetail.users[0].role) ? "/home" : "/company";


    if (navigateTo === "/home") {
      console.log(navigateTo)
      const companyDBDetails = await Company.findOne({ _id: userDetail?.accountOwner }, { database: 1 });

      const { EmpMaster, AspNetUsers, AspNetRoles } = await getTenantDBModels(companyDBDetails?.database.dbName);


      const user = await AspNetUsers.findOne({ UserName: userDetail.users[0].username }).select("-PasswordHash");
      console.log("user from login", user)
      if (!user) {
        throw new ApiErrorResponse(
          StatusCodes.UNAUTHORIZED,
          "Invalid Username or Password"
        );
      }

      const empRoleId = await EmpMaster.findOne({ UserId: user.Id }).select("RoleId").lean();

      const roles = await AspNetRoles.find(
        {
          Id:
          {
            $in:
              [empRoleId.RoleId]
            // ["82763a68-4d8d-4358-96a5-c2d2981e3d0a"]
            // emp.RoleId

          }
        }
      ).lean();

      const rolesString = roles.map(role => role.Name)

      const userPermissions = await GetUserPermissionMasterQuery({
        userId: user.Id
        // user.Id
      })

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
        token: generateAccessToken(),
        expiration: Number(process.env.ACCESS_TOKEN_EXPIRY) / 1000, // 5 years
        isSuccess: true,
        navigateTo: navigateTo,
        message: "Login Successful",
        data: {
          userDetail: {
            id: user.Id,
            userName: user.UserName,
            email: user.Email,
            phoneNumber: user.PhoneNumber,
            roles: rolesString, // ["User"]//
          },
          permissions: userPermissions?.data //formattedData(userPermissions),
        }
      };

      return { response, refreshToken: generateRefreshToken() };
    }

    if (navigateTo === "/company") {
      console.log(navigateTo)

      response = {
        navigateTo: navigateTo,
        token: generateAccessToken(),
      }
      return { response, refreshToken: generateRefreshToken() };
    }
  } catch (error) {
    throw error;
  }
}