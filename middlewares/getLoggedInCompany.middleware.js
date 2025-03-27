// import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { Company } from "../modals/index.js";
import { ApiErrorResponse } from "../utils/apiResponse/index.js";

const excludedRoutes = ["/api/Auth/login", "/api/Auth/Refresh", "/api/Auth/Logout", "/v2/api/auth/register"];

const getLoggedInCompany = async (req, res, next) => {
  try {
    if (excludedRoutes.includes(req.path)) {
      return next();
    }
    if (!req.headers["authorization"]) return next(new ApiErrorResponse(StatusCodes.UNAUTHORIZED, "Access Denied"));

    const token = req.headers["authorization"].split(" ")[1];
        
    const payloadData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const company = await Company.find( 
    { $or: [
        { _id: payloadData.Id },
        // { UserName: payloadData.UserName }
    ]})

    if (!company) {
      return res.status(StatusCodes.UNAUTHORIZED).json(new ApiErrorResponse(StatusCodes.UNAUTHORIZED, "Please login again"));
    }

    req.company = company;
    next()
  } catch (error) {
    error.ErrorMessage = error.ErrorMessage || error.message;
    next(error)
  }
};


export default getLoggedInCompany;