import { StatusCodes } from "http-status-codes";
import {
  ApiErrorResponse,
  ApiSuccessResponse,
  CommonResponse,
} from "../../utils/apiResponse/index.js";
import { validateSigninModel } from "../../utils/validation/joi.js";
import { v2AuthService } from "../../services/index.js";
import { authControllerResponse as apiTextResponse } from "../../utils/static-response-message/index.js";
import { getCentralDBModels, getTenantDBModels } from "../../db/index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import sendMailService from "../../utils/emailService/nodeMailer.js";
import argon2 from "argon2";
import axios from "axios";
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
      await v2AuthService.signinService(value);

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "None", // ✅ Required for cross-site requests
    };

    return res
      .status(StatusCodes.OK)
      .cookie("refreshToken", refreshToken, options)
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

//------- logout ----------->

export async function logout(req, res, next) {
  try {
    const { tenant_db } = await getTenantDBModels();
    await tenant_db.close();
    res.clearCookie("refreshToken");
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
  try {
    const { Idp_account } = await getCentralDBModels();

    const oldRefreshToken = req?.cookies?.refreshToken;

    if (!oldRefreshToken)
      throw new ApiErrorResponse(
        StatusCodes.UNAUTHORIZED,
        "Refresh token required"
      );

    // we are not storing refreshToken inside db we used httpOnly Cookie
    const { userId } = jwt.verify(
      oldRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const { response, refreshToken } = await v2AuthService.refreshService(
      userId
    );

    const successResponse = new CommonResponse(1, "login successful", response);

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "None", // ✅ Required for cross-site requests
    };

    return res
      .status(StatusCodes.OK)
      .cookie("refreshToken", refreshToken, options)
      .json(successResponse);
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      // JsonWebTokenError this errors contains actual error msg, we should avoid to provide actual error
      return next(
        new ApiErrorResponse(StatusCodes.UNAUTHORIZED, "Access Denied")
      );
    } else if (err.name === "TokenExpiredError") {
      return next(
        new ApiErrorResponse(
          StatusCodes.UNAUTHORIZED,
          "Refresh Token Expired, please login again"
        )
      );
    } else {
      return next(err);
    }
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
    const { Idp_account } = await getCentralDBModels();
    const { username, captchaResponse } = req.body;

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

    // 1. Check user existence
    const existingUser = await Idp_account.findOne({ "users.username": username }, { "users.$": 1 });

    if (!existingUser) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(
          new ApiErrorResponse(StatusCodes.NOT_FOUND, "User not Found")
        );
    }

    console.log("existingUser", existingUser)
    // 2. Find the user in the array
    const targetUser = existingUser.users.find(
      (user) => user.username === username
    );

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

    const updatedUser = await Idp_account.updateOne({ "users.username": username }, {
      $set: {
        "users.$.resetToken": hashedToken,
        "users.$.tokenExpires": Date.now() + 15 * 60 * 1000
      }
    })

    if (!updatedUser.acknowledged || updatedUser.modifiedCount !== 1) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new ApiErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Try Again!! Some error occured"))
    }

    const resetUrl = process.env.RESET_LINK
    const resetLink = `${resetUrl}token=${token}`;

    // 5. Send email
    const from = process.env.NODEMAILER_EMAIL_USER;
    const to = "saurabhkushwaha9889@gmail.com";
    const subject = `Reset Your Password`;
    const html = `
          <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
            <h2 style="color: #003380;">Password Reset Request</h2>
            <p>Hello ${targetUser.username},</p>
            <p>We received a request to reset your password. If you made this request, please click the button below to reset your password:</p>
            <p style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="background-color: #003380; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Reset Password
              </a>
            </p>
            <p>If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
            <p style="margin-top: 40px;">Best regards,<br/>The VTS App Team</p>
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
      "users.tokenExpires": { $gt: Date.now() },
    });
    if (!account) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(
          new ApiErrorResponse(
            StatusCodes.NOT_FOUND,
            "Token is invalid or has expired",
            false
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
    user.password = await argon2.hash(password);

    // Clear reset token fields
    user.resetToken = undefined;
    user.tokenExpires = undefined;

    // Save updated user
    await account.save();

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
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        new ApiErrorResponse(
          StatusCodes.NOT_FOUND,
          "Something went wrong",
          false
        )
      );
  }
}
