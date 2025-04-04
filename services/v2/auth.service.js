import { StatusCodes } from "http-status-codes";
// import { Company, Idp_account } from "../../modals/index.js";
import { ApiErrorResponse } from "../../utils/apiResponse/index.js";
import { authControllerResponse as apiTextResponse } from "../../utils/static-response-message/index.js"
import jwt from "jsonwebtoken";
import { getCentralDBModels } from "../../db/index.js";
import { connectTenantDB } from "../../db/connectMongoDB.js";


export async function signinService(value) {

  const { Idp_account, Company } = await getCentralDBModels(); // geting models
  value.username.toLowerCase();

  // fetching data from users array
  const isUserRegistered = await Idp_account.findOne({ "users.username": value.username });

  // console.log("isUserRegistered", isUserRegistered)

  if (!isUserRegistered) {
    throw new ApiErrorResponse(StatusCodes.BAD_REQUEST, apiTextResponse.notFound);
  }

  const isValidPassword = await isUserRegistered.isValidPasswordForUsers(value.username, value.password);

  if (!isValidPassword) {
    throw new ApiErrorResponse(StatusCodes.UNAUTHORIZED, apiTextResponse.inValidIdp);
  }

  const companyDBDetails = await Company.findById(isUserRegistered.accountOwner).select("database");
 

  if(companyDBDetails){
    await connectTenantDB(companyDBDetails.database.dbName);
  }
 
  console.log("companyDBDetails", companyDBDetails)
  /**
   * if companyDBDetails not present means SuperAdmin is logged in.
   */

  function generateRefreshToken() {
    const payload = {
      userId: isUserRegistered.users[0]._id,
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
      ownerId: isUserRegistered._id,
      userId: isUserRegistered.users[0]._id,
      username: isUserRegistered.users[0].username,
      email: isUserRegistered.users[0].email,
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
    role: isUserRegistered.users[0].role,
    username: isUserRegistered.users[0].username,
    navigateTo: navigateTo,
    // dbName: companyDBDetails?.database?.dbName || null
  }
}