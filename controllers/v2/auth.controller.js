import { StatusCodes } from "http-status-codes";
import { ApiErrorResponse, ApiSuccessResponse } from "../../utils/apiResponse/index.js";
import { validateSigninModel } from "../../utils/validation/joi.js";
import { v2AuthService } from "../../services/index.js";
import { loginQuery } from "../../utils/DBQueries/Auth.Query.js";
import { authControllerResponse as apiTextResponse } from "../../utils/static-response-message/index.js";
import { getCentralDBModels } from "../../db/index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import sendMailService from "../../utils/emailService/nodeMailer.js";
import axios from "axios";
import { BRAND } from "../../config/brand.js";
import {
  normalizeCompanyCode,
  normalizeSignInUsername,
  normalizeWorkspaceSlug,
  resolveCompanyFromTenantSignIn,
  findIdpBySignInForForgotPassword,
  findEmbeddedUserBySignInName,
} from "../../utils/tenantLogin.js";
import {
  getRefreshCookieSetOptions,
  clearRefreshTokenCookie,
} from "../../config/refreshCookieOptions.js";

//------- signin ----------->

export async function signin(req, res, next) {
  try {
    const model = req.body;
    console.log("model is", model);
    const { value, error } = validateSigninModel(model);
    if (error) {
      throw new ApiErrorResponse(
        StatusCodes.BAD_REQUEST,
        error.details[0].message
      );
    }
    const { accessToken, refreshToken, role, navigateTo, username } =
      await v2AuthService.signinService(value, req.company);
    const refreshCookie = getRefreshCookieSetOptions(refreshToken);

    return res
      .status(StatusCodes.OK)
      .cookie("refreshToken", refreshToken, refreshCookie)
      .json(
        new ApiSuccessResponse(
          true,
          StatusCodes.OK,
          apiTextResponse.loginSuccess,
          { accessToken, role, navigateTo, username }
        )
      );
  } catch (error) {
    next(error);
  }
}

/**
 * Legacy tenant AspNet user session (permissions + `authUserData` shape for Redux).
 * Requires `Authorization: Bearer` from v2 sign-in. Prefer over `POST /api/Auth/login`.
 * Body: `{ username, password?, dbName? }` — `dbName` required for SuperAdmin switch until tenant is in JWT context.
 */
export async function tenantLogin(req, res, next) {
  try {
    const { response } = await loginQuery(req.body);
    const successResponse = ApiSuccessResponse.common(
      1,
      "Login Successful",
      response,
      response.data.permissions.length
    );
    return res.status(StatusCodes.OK).json(successResponse);
  } catch (error) {
    next(error);
  }
}

//------- logout ----------->

export async function logout(req, res, next) {
  try {
    // Tenant connections are shared per dbName; closing here would break other users.
    clearRefreshTokenCookie(res);
    return res.status(StatusCodes.OK).json(
      new ApiSuccessResponse(
        true,
        StatusCodes.OK,
        "User successfully logged out",
        {
          navigateTo: "/login",
        }
      )
    );
  } catch (error) {
    next(error);
  }
}

export async function refresh(req, res, next) {
  const oldRefreshToken = req?.cookies?.refreshToken;
  if (!oldRefreshToken) {
    // Expected when no prior session, anonymous users, or cookie not yet stored — return 401 without global error log
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json(
        new ApiErrorResponse(
          StatusCodes.UNAUTHORIZED,
          "No refresh session"
        )
      );
  }

  try {
    const { userId } = jwt.verify(
      oldRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const { response, refreshToken } = await v2AuthService.refreshService(
      userId
    );
    const refreshCookie = getRefreshCookieSetOptions(refreshToken);

    const successResponse = ApiSuccessResponse.common(1, "login successful", response);

    return res
      .status(StatusCodes.OK)
      .cookie("refreshToken", refreshToken, refreshCookie)
      .json(successResponse);
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(new ApiErrorResponse(StatusCodes.UNAUTHORIZED, "Access Denied"));
    }
    if (err.name === "TokenExpiredError") {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(
          new ApiErrorResponse(
            StatusCodes.UNAUTHORIZED,
            "Refresh Token Expired, please login again"
          )
        );
    }
    if (err.name === "ApiErrorResponse" && err.statusCode) {
      return res
        .status(err.statusCode)
        .json(new ApiErrorResponse(err.statusCode, err.message));
    }
    return next(err);
  }
}
//------- createSuperAdmin ----------->

export async function createSuperAdmin(req, res, next) {
  try {
    const model = req.body;
  } catch (error) { }
}

// Forgot-Password

export async function forgotPassword(req, res, next) {
  try {
    const { Idp_account, Company } = await getCentralDBModels();
    const { username, captchaResponse, companyCode, workspaceSlug } = req.body;
    const uName = normalizeSignInUsername(username);
    const codeRaw = companyCode != null && String(companyCode).trim() !== "" ? companyCode : "";
    const slugRaw = workspaceSlug != null && String(workspaceSlug).trim() !== "" ? workspaceSlug : "";
    const hasTenantHint = Boolean(codeRaw || slugRaw);

    // GOOGLE_CAPTCHA_SECRET_KEY

    const captchaSecret = process.env.GOOGLE_CAPTCHA_SECRET_KEY;
    const url = process.env.GOOGLE_CAPTCHA_URL

    // Verify CAPTCHA
    const captchaValidationResponse = await axios.post(url, null,
      {
        params: {
          secret: captchaSecret,
          response: captchaResponse,
        },
      }
    );
    // if status is not true
    if (!captchaValidationResponse.status === 200) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(
          new ApiErrorResponse(StatusCodes.BAD_REQUEST, "Invalid CAPTCHA")
        );
    }

    const company = hasTenantHint
      ? await resolveCompanyFromTenantSignIn(Company, {
          companyCode: normalizeCompanyCode(codeRaw),
          workspaceSlug: normalizeWorkspaceSlug(slugRaw),
        })
      : null;
    if (hasTenantHint && !company) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(
          new ApiErrorResponse(
            StatusCodes.NOT_FOUND,
            "Workspace not found. Use your signup workspace id."
          )
        );
    }

    // 1. Check user — same identifiers as sign-in: username, user email, or Idp / admin email
    const existingUser = await findIdpBySignInForForgotPassword(
      Idp_account,
      company ? company._id : undefined,
      uName
    );

    if (!existingUser) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(
          new ApiErrorResponse(StatusCodes.NOT_FOUND, "User not Found")
        );
    }

    // 2. Resolve embedded user (must match the sign-in name used in step 1)
    const targetUser = findEmbeddedUserBySignInName(existingUser.users, uName);

    if (!targetUser) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(
          new ApiErrorResponse(
            StatusCodes.NOT_FOUND,
            "User not Found in account"
          )
        );
    }

    // 3. Generate token
    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // 4. Set resetToken and tokenExpires
    targetUser.resetToken = hashedToken;
    targetUser.tokenExpires = Date.now() + 15 * 60 * 1000; // 15 minutes

    const updatedUser = await Idp_account.updateOne(
      { _id: existingUser._id, "users._id": targetUser._id },
      {
        $set: {
          "users.$.resetToken": hashedToken,
          "users.$.tokenExpires": Date.now() + 15 * 60 * 1000,
        },
      }
    );

    if (!updatedUser.acknowledged || updatedUser.modifiedCount !== 1) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new ApiErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Try Again!! Some error occured"))
    }

    const resetUrl = process.env.RESET_LINK
    const resetLink = `${resetUrl}token=${token}`;

    // 5. Send email
    const from = process.env.NODEMAILER_EMAIL_USER;
    const to = "saurabhkushwaha9889@gmail.com";
    const subject = `${BRAND.name}: Reset your password`;
    const html = `
          <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
            <h2 style="color: #003380;">${BRAND.name} Password Reset Request</h2>
            <p>Hello ${targetUser.username},</p>
            <p>We received a request to reset your password. If you made this request, please click the button below to reset your password:</p>
            <p style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="background-color: #003380; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Reset Password
              </a>
            </p>
            <p>If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
            <p style="margin-top: 40px;">Best regards,<br/>The ${BRAND.name} Team</p>
            <p style="font-size: 12px; color: #666;">Need help? Contact us at ${BRAND.supportEmail}</p>
          </div>
        `;

    await sendMailService(from, to, subject, "Reset password", html);

    return res
      .status(StatusCodes.OK)
      .json(
        new ApiSuccessResponse(
          true,
          StatusCodes.OK,
          "📧 Password reset link sent to mail"
        )
      );
  } catch (error) {
    next(new ApiErrorResponse(StatusCodes.NOT_FOUND, error.message))
  }
}

// Reset-Password
export async function resetPassword(req, res, next) {
  try {
    const { Idp_account } = await getCentralDBModels();
    const { token, password } = req.body;

    // if (!token || !newPassword) {
    //   return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Invalid request" });
    // }
    // Hash the token received from user
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find the account with matching hashed token and valid expiry
    const account = await Idp_account.findOne({
      "users.resetToken": hashedToken,
      "users.tokenExpires": { $gt: Date.now() }
    }, { "users.$": 1 });
    if (!account) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(
          new ApiErrorResponse(
            StatusCodes.NOT_FOUND,
            "Token is invalid or has expired"
          )
        );
    }

    // Find the exact user within the array
    const user = account.users.find(
      (user) =>
        user.resetToken === hashedToken && user.tokenExpires > Date.now()
    );

    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(
          new ApiErrorResponse(
            StatusCodes.NOT_FOUND,
            "User not found or token expired",
            false
          )
        );
    }

    // Hash and update the new password
    // user.password = await argon2.hash(password);

    // Clear reset token fields
    // user.resetToken = null;
    // user.tokenExpires = null;

    // Save updated user
    const updatedUser = await Idp_account.updateOne({
      "users.resetToken": hashedToken,
      "users.tokenExpires": { $gt: Date.now() }
    }, {
      $set: {
        // "users.$.password": await argon2.hash(password), // new hashed password
        "users.$.password": bcrypt.hashSync(password, 10), // new hashed password
      },
      $unset: {
        "users.$.resetToken": null,
        "users.$.tokenExpires": null
      }
    })

    if (!updatedUser.acknowledged || updatedUser.modifiedCount !== 1) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new ApiErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Try Again!! Some error occured"))
    }

    return res
      .status(StatusCodes.OK)
      .json(
        new ApiSuccessResponse(
          true,
          StatusCodes.OK,
          "Password has been reset successfully"
        )
      );
  } catch (error) {
    console.error("Reset password error:", error);

    next(new ApiErrorResponse(
      StatusCodes.INTERNAL_SERVER_ERROR,
      error.message
    ))
  }
}
