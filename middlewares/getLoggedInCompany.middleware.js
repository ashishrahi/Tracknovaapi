// import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
// import { Company } from "../modals/index.js";
import { ApiErrorResponse } from "../utils/apiResponse/index.js";
import jwt from "jsonwebtoken";
import { getCentralDBModels } from "../db/index.js";
import { setRequestTenantDbName } from "../db/tenantContext.js";


const excludedRoutes = [
  "/api/Auth/login",
  "/api/Auth/Register",
  "/api/Auth/Refresh",
  "/api/v2/auth/signin",
  "/api/v2/auth/refresh",
  "/api/v2/auth/forgot-password",
  "/api/v2/auth/reset-password",
  /** Public tenant self-serve registration (no JWT). */
  "/api/v2/company/register",
];

const getLoggedInCompany = async (req, res, next) => {
  try {
    const { Company, Idp_account } = await getCentralDBModels();
    if (excludedRoutes.includes(req.path) || req.path.startsWith("/api/v2/public/")) {
      return next();
    }
    if (!req.headers["authorization"]) return next(new ApiErrorResponse(StatusCodes.UNAUTHORIZED, "Access Denied due to access token not provided"));

    const token = req.headers["authorization"].split(" ")[1];

    /**
     * for SuperAdmin JWT token ownerId is "SuperAdmin"
    */

    const { ownerId, userId, username } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // console.table({ownerId, userId, username})
    // console.log("Payload is", payload);

    /*
    * ownerId === company objectid. Company has all details
    * userId === idp_accounts have users array.
    */

    const user = await Idp_account.findOne({ "users._id": userId }, { "users.$": 1, accountOwner: 1 });



    /**
     * If ownerId is not present it means SuperAdmin is logged in.
    */

    let company;
    if (ownerId !== "SuperAdmin") {
      company = await Company.findById(ownerId);
    }
    // console.log("user from getLoggedInuser", user );
    // console.log("company from getLoggedInuser", company );

    // console.log("Company from getloggedinUser", company)

    /**
     * If company is not present it means user is a SuperAdmin
     */

    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json(new ApiErrorResponse(StatusCodes.UNAUTHORIZED, "Please be a valid user"));
    }

    req.company = company || "SuperAdmin";
    if (req.company && req.company !== "SuperAdmin" && req.company?.database?.dbName) {
        setRequestTenantDbName(req.company.database.dbName);
    }
    req.user = user;
    next()
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      // JsonWebTokenError this errors contains actual error msg, we should avoid to provide actual error
      return next(new ApiErrorResponse(StatusCodes.UNAUTHORIZED, "Access Denied"));
  } else if(err.name === "TokenExpiredError"){
      return next(new ApiErrorResponse(StatusCodes.UNAUTHORIZED, "Session expired, please login again"))
  }else {
      return next(err) 
  }
  }
};


export default getLoggedInCompany;