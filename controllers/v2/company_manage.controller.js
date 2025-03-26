import { StatusCodes } from "http-status-codes";
import { ApiErrorResponse } from "../../utils/apiResponse/index.js";
import { validateRegisterCompanyModel } from "../../utils/validation/joi.js";

export async function register(req, res, next){
    try {
        const model = req.body;

        const { value, error } = validateRegisterCompanyModel(model);

        if(error){
            throw new ApiErrorResponse(StatusCodes.BAD_REQUEST,error.details[0].message);
        }

        

        return res.json(error)

    } catch (error) {
        next(error);
    }
}