import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { ApiErrorResponse } from "../utils/apiResponse/index.js";
import { getTenantDBModels } from "../db/index.js";
import { getRequestTenantDbName } from "../db/tenantContext.js";

const excludedRoutes = ["/api/Auth/login", "/api/Auth/Refresh", "/api/Auth/Logout"];

async function verifyAccessToken(req, res, next){
    try {
        // skipping for login route
        if (excludedRoutes.includes(req.path)) {
            return next(); 
        }
        // console.log("request headers body is",req.headers)
        if (!req.headers["authorization"]) return next(new ApiErrorResponse(StatusCodes.UNAUTHORIZED, "Access Denied"));
    
        const token = req.headers["authorization"].split(" ")[1];
        
        const payloadData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
        if (getRequestTenantDbName()) {
            const { AspNetUsers } = await getTenantDBModels();
            const user = await AspNetUsers.findOne( 
            { $or: [
                { UserName: payloadData.username }
            ]}).select("-PasswordHash");
            req.user = user;
        }
        // console.log(user)
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
}




export default verifyAccessToken



