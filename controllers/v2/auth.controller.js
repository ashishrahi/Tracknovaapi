import { StatusCodes } from "http-status-codes";
import { ApiErrorResponse, ApiSuccessResponse, CommonResponse } from "../../utils/apiResponse/index.js";
import { validateSigninModel } from "../../utils/validation/joi.js";
import { v2AuthService } from "../../services/index.js";
import { authControllerResponse as apiTextResponse } from "../../utils/static-response-message/index.js"
import { getCentralDBModels, getTenantDBModels } from "../../db/index.js"
import jwt from "jsonwebtoken";

//------- signin ----------->

export async function signin(req, res, next) {
    try {
        const model = req.body;
        // console.log("model is", model)
        const { value, error } = validateSigninModel(model);
        if (error) {
            throw new ApiErrorResponse(StatusCodes.BAD_REQUEST, error.details[0].message);
        }
        const { accessToken, refreshToken, role, navigateTo, username } = await v2AuthService.signinService(value);

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "None", // ✅ Required for cross-site requests
        };

        return res.status(StatusCodes.OK)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiSuccessResponse(true, StatusCodes.OK, apiTextResponse.loginSuccess, { accessToken, role, navigateTo, username }))

    } catch (error) {
        next(error);
    }
}

//------- logout ----------->

export async function logout(req, res, next) {
    try {
        const { tenant_db } = await getTenantDBModels()
        await tenant_db.close();
        res.clearCookie("refreshToken");
        return res.status(StatusCodes.OK).json(new ApiSuccessResponse(true, StatusCodes.OK, "User successfully logged out", {
            navigateTo: "/login"
        }))
    } catch (error) {
        next(error);
    }
}

export async function refresh(req, res, next) {
    try {
        const { Idp_account } = await getCentralDBModels();

        const oldRefreshToken = req.cookies.refreshToken;
        if (!oldRefreshToken) throw new ApiErrorResponse(StatusCodes.UNAUTHORIZED, "Refresh token required");

        // we are not storing refreshToken inside db we used httpOnly Cookie
        const { userId } = jwt.verify(oldRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        const { response, refreshToken} = await v2AuthService.refreshService(userId);

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
        } else if (err.name === "TokenExpiredError") {
            return next(new ApiErrorResponse(StatusCodes.UNAUTHORIZED, "Refresh Token Expired, please login again"))
        } else {
            return next(err)
        }
    }
}
//------- createSuperAdmin ----------->

export async function createSuperAdmin(req, res, next) {
    try {
        const model = req.body;

    } catch (error) {

    }
}
