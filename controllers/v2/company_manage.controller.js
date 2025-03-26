import { StatusCodes } from "http-status-codes";
import { ApiErrorResponse, ApiSuccessResponse } from "../../utils/apiResponse/index.js";
import { validateRegisterCompanyModel } from "../../utils/validation/joi.js";
import { Company } from "../../modals/index.js"
import { companyManageControllerResponse as apiTextResponse } from "../../utils/static-response-message/index.js";
import { v2CompanyManageService } from "../../services/index.js";

export async function register(req, res, next) {
    try {
        const model = req.body;
        console.log("Model is for", model)
        const { value, error } = validateRegisterCompanyModel(model);

        if (error) {
            throw new ApiErrorResponse(StatusCodes.BAD_REQUEST, error.details[0].message);
        }

        const resgiteredNewCompany = await v2CompanyManageService.registerService(value)
        
        return res.json(new ApiSuccessResponse(true, StatusCodes.OK, apiTextResponse.companycreated, resgiteredNewCompany ) )

    } catch (error) {
        console.log("error from controller", error)
        next(error);
    }
}

export async function find(req, res, next){
    try {
        const companies = await v2CompanyManageService.findService();
        return res.json(new ApiSuccessResponse(true, StatusCodes.OK, apiTextResponse.findCompany, companies) )

    } catch (error) {
        throw error;
    }

}