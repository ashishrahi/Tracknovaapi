import { StatusCodes } from "http-status-codes";
import { ApiErrorResponse, ApiSuccessResponse } from "../../utils/apiResponse/index.js";
import { getCentralDBModels } from "../../db/index.js";
import { validatePatchTenantBranding } from "../../utils/validation/joi.js";

function assertCompanyUser(req) {
  if (!req.company || req.company === "SuperAdmin") {
    throw new ApiErrorResponse(
      StatusCodes.NOT_FOUND,
      "Tenant branding is only available for company users"
    );
  }
}

/**
 * @returns {import("mongoose").Document | null}
 */
function getCompanyDocOrThrow(req) {
  assertCompanyUser(req);
  return req.company;
}

function assertTenantAdmin(req) {
  assertCompanyUser(req);
  const r = req.user?.users?.[0]?.role;
  if (r !== "Admin") {
    throw new ApiErrorResponse(
      StatusCodes.FORBIDDEN,
      "Only tenant administrators can update company branding"
    );
  }
}

function brandingDto(company) {
  const loginBranding = company.loginBranding || {};
  return {
    companyName: company.companyName,
    tenantName: company.companyName,
    logoUrl: loginBranding.logoUrl || null,
    primaryColor: loginBranding.primaryColor || null,
    supportEmail: loginBranding.supportEmail || null,
    defaultSupportEmail: company.companyEmail || null,
    themeMode: null,
    workspaceSlug: company.workspaceSlug || null,
  };
}

/**
 * Dashboard chrome branding for the tenant associated with the JWT.
 * SuperAdmin tokens have no tenant company — not found for that role.
 */
export async function getTenantBranding(req, res, next) {
  try {
    const company = getCompanyDocOrThrow(req);
    return res
      .status(StatusCodes.OK)
      .json(
        new ApiSuccessResponse({
          isSuccess: true,
          statusCode: StatusCodes.OK,
          message: "OK",
          data: brandingDto(company),
        })
      );
  } catch (err) {
    next(err);
  }
}

const LOGO_MAX_CHARS = 1_500_000;

/**
 * Updates company name, login branding (logo, color, support email) for the tenant.
 * Only company users with Idp `Admin` may update.
 */
export async function patchTenantBranding(req, res, next) {
  try {
    assertTenantAdmin(req);
    const { error, value } = validatePatchTenantBranding(req.body);
    if (error) {
      const msg = error.details?.[0]?.message || "Invalid request body";
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(new ApiErrorResponse(StatusCodes.BAD_REQUEST, msg));
    }

    if (value.logoDataUrl) {
      const s = value.logoDataUrl;
      if (!s.startsWith("data:image/")) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json(
            new ApiErrorResponse(
              StatusCodes.BAD_REQUEST,
              "Logo must be a data URL (image/png, image/jpeg, etc.)"
            )
          );
      }
      if (s.length > LOGO_MAX_CHARS) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json(
            new ApiErrorResponse(
              StatusCodes.BAD_REQUEST,
              "Logo image is too large; use a smaller file (about 1MB or less)"
            )
          );
      }
    }

    const { Company } = await getCentralDBModels();
    if (!Company) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(
          new ApiErrorResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            "Service temporarily unavailable"
          )
        );
    }

    const id = req.company._id;
    const $set = {};
    const $unset = {};

    if (value.companyName != null) {
      $set.companyName = value.companyName;
    }
    if (value.clearLogo === true) {
      $unset["loginBranding.logoUrl"] = "";
    } else if (value.logoDataUrl) {
      $set["loginBranding.logoUrl"] = value.logoDataUrl;
    }
    if (value.primaryColor !== undefined) {
      if (value.primaryColor == null || value.primaryColor === "") {
        $unset["loginBranding.primaryColor"] = "";
      } else {
        $set["loginBranding.primaryColor"] = value.primaryColor;
      }
    }
    if (value.supportEmail !== undefined) {
      if (value.supportEmail == null || value.supportEmail === "") {
        $unset["loginBranding.supportEmail"] = "";
      } else {
        $set["loginBranding.supportEmail"] = String(value.supportEmail).toLowerCase().trim();
      }
    }

    const update = {};
    if (Object.keys($set).length) update.$set = $set;
    if (Object.keys($unset).length) update.$unset = $unset;

    if (!update.$set && !update.$unset) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(new ApiErrorResponse(StatusCodes.BAD_REQUEST, "No valid changes to apply"));
    }

    const updated = await Company.findByIdAndUpdate(id, update, { new: true, runValidators: true });
    if (!updated) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(new ApiErrorResponse(StatusCodes.NOT_FOUND, "Company not found"));
    }

    return res.status(StatusCodes.OK).json(
      new ApiSuccessResponse({
        isSuccess: true,
        statusCode: StatusCodes.OK,
        message: "Branding updated",
        data: brandingDto(updated),
      })
    );
  } catch (err) {
    next(err);
  }
}
