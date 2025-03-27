import { StatusCodes } from "http-status-codes";
import { ApiErrorResponse, ApiSuccessResponse } from "../../utils/apiResponse/index.js";
import { validateSigninModel } from "../../utils/validation/joi.js";
import { v2AuthService } from "../../services/index.js";
import { authControllerResponse as apiTextResponse } from "../../utils/static-response-message/index.js"
export async function signin(req, res, next) {
    try {
        const model = req.body;
        console.log("model is", model)
        const { value, error } = validateSigninModel(model);
        if (error) {
            throw new ApiErrorResponse(StatusCodes.BAD_REQUEST, error.details[0].message);
        }
        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "None", // ✅ Required for cross-site requests
        };
        const { accessToken, refreshToken, role } = await v2AuthService.signinService(value);

        return res.status(StatusCodes.OK)
            // .cookie("refreshToken")
            .json(new ApiSuccessResponse(true, StatusCodes.OK, apiTextResponse.loginSuccess, {accessToken, role}))

    } catch (error) {
        next(error);
    }
}