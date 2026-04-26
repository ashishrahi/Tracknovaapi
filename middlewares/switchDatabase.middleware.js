import { ApiErrorResponse } from "../utils/apiResponse/index.js";
import { StatusCodes } from "http-status-codes";
import { connectTenantDB } from "../db/connectMongoDB.js";
import { setRequestTenantDbName } from "../db/tenantContext.js";

/**
 * Binds a tenant connection for the current request and middleware chain.
 * Expects getLoggedInCompany to have set `req.company` and JWT context.
 */
async function switchDatabase(req, res, next) {
  try {
    const company = req.company;

    if (!company) {
      return next(new ApiErrorResponse(StatusCodes.UNAUTHORIZED, "Please Login"));
    }

    if (company === "SuperAdmin") {
      return next(
        new ApiErrorResponse(StatusCodes.BAD_REQUEST, "No tenant context for this operation")
      );
    }

    const dbName = company?.database?.dbName;
    if (!dbName) {
      return next(
        new ApiErrorResponse(StatusCodes.BAD_REQUEST, "Company database is not configured")
      );
    }

    setRequestTenantDbName(dbName);
    const tenantDB = await connectTenantDB(dbName);

    if (!tenantDB) {
      throw new ApiErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to open tenant database");
    }

    req.db = tenantDB;
    console.log(`🔹 Tenant models bound for database: ${dbName}`);
    next();
  } catch (error) {
    console.error("Database switching error:", error);
    return res
      .status(500)
      .json(
        new ApiErrorResponse(
          StatusCodes.INTERNAL_SERVER_ERROR,
          error?.message || "Error switching database"
        )
      );
  }
}

export default switchDatabase;
