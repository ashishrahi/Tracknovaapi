import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { ApiErrorResponse } from "../utils/apiResponse/index.js";
import AspNetUsers from "../modals/AspNetUsers.model.js";

async function verifyAccessToken(req, res, next){
    try {
        if (!req.headers["authorization"]) throw (new ApiErrorResponse(StatusCodes.UNAUTHORIZED, "Access Denied"));
    
        const token = req.headers["authorization"].split(" ")[1];
        const payloadData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
        const user = await AspNetUsers.findOne( 
        { $or: [
            { Id: payloadData.Id },
            { UserName: payloadData.UserName }
        ]}).select("-PasswordHash")
        req.user = user;
        next()
    } catch (err) {
        if (err.name === "JsonWebTokenError") {
            // JsonWebTokenError this errors contains actual error msg, we should avoid to provide actual error
            return next(new ApiErrorResponse(StatusCodes.UNAUTHORIZED, "Access Denied"));
        } else {
            return next(err) 
        }
    }
}

export default verifyAccessToken




// (err, payload) => {
//     if (err) {
//       if (err.name === "JsonWebTokenError") {
//         // JsonWebTokenError this errors contains actual error msg, we should avoid to provide actual error
//         return res.status(401).json({ msg: "Unauthorised" });
//       } else {
//         return res.status(401).json({ msg: err.message });
//       }
//     }

//     req.payload = payload;
//     // console.log(isReal);
//     next();
//   }