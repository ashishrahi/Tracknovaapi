import { StatusCodes } from "http-status-codes";
import { getCentralDBModels } from "../../db/index.js";
import { ApiErrorResponse, ApiSuccessResponse } from "../../utils/apiResponse/index.js";
import { normalizeWorkspaceSlug } from "../../utils/tenantLogin.js";

/**
 * Public, unauthenticated: resolve a workspace for login branding and client-side validation.
 * GET /api/v2/public/workspace/:workspaceSlug
 */
export async function getWorkspaceBySlug(req, res, next) {
  try {
    const raw = req.params.workspaceSlug;
    const slug = normalizeWorkspaceSlug(raw);
    if (!slug) {
      throw new ApiErrorResponse(StatusCodes.BAD_REQUEST, "Invalid workspace");
    }
    const { Company } = await getCentralDBModels();
    if (!Company) {
      throw new ApiErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Service unavailable");
    }
    const c = await Company.findOne({ workspaceSlug: slug })
      .select("companyName workspaceSlug loginBranding")
      .lean();
    if (!c) {
      throw new ApiErrorResponse(StatusCodes.NOT_FOUND, "Workspace not found");
    }
    const lb = c.loginBranding || null;
    const hasBranding = lb && (lb.logoUrl || lb.primaryColor || lb.supportEmail);
    const loginBranding = hasBranding
      ? {
          logoUrl: lb.logoUrl || null,
          primaryColor: lb.primaryColor || null,
          supportEmail: lb.supportEmail || null,
        }
      : null;
    return res.status(StatusCodes.OK).json(
      new ApiSuccessResponse(true, StatusCodes.OK, "Workspace resolved", {
        companyName: c.companyName,
        workspaceSlug: c.workspaceSlug,
        loginBranding,
      })
    );
  } catch (e) {
    next(e);
  }
}
