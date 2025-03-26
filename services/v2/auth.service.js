import { StatusCodes } from "http-status-codes";
import { Idp_account } from "../../modals/index.js";
import { ApiErrorResponse } from "../../utils/apiResponse/index.js";
import { authControllerResponse as apiTextResponse } from "../../utils/static-response-message/index.js"
import jwt from "jsonwebtoken";


export async function signinService(value){
    const isUserRegistered = await Idp_account.findOne({username: value.username.toLowerCase()});

    if(!isUserRegistered){
        throw new ApiErrorResponse(StatusCodes.BAD_REQUEST, apiTextResponse.notFound)
    }

    const isValidPassword = await isUserRegistered.isValidPassword(value.password);

    if(!isValidPassword){
        throw new ApiErrorResponse(StatusCodes.UNAUTHORIZED, apiTextResponse.inValidIdp)
    }

    function generateRefreshToken(){
        const payload = {
            Id: isUserRegistered.accountOwner
          }
          const secret = process.env.REFRESH_TOKEN_SECRET;
          const option = {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
            issuer: process.env.JWTOKEN_ISSUER_NAME
          }
          const token = jwt.sign(payload, secret, option);
          return token;
    }

    function generateAccessToken(){
      const payload = {
        Id: isUserRegistered.accountOwner,
        // UserName: this.UserName,
        // Email: this.Email
      }
      const secret = process.env.ACCESS_TOKEN_SECRET;
      const option = {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        issuer: process.env.JWTOKEN_ISSUER_NAME
      }
      const token = jwt.sign(payload, secret, option);
      return token;
    }

    return {
        accessToken : generateAccessToken(),
        refreshToken: generateRefreshToken()
    }
}