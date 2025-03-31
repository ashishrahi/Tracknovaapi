import { StatusCodes } from "http-status-codes";
// import { Company, Idp_account } from "../../modals/index.js";
import { ApiErrorResponse } from "../../utils/apiResponse/index.js";
import { companyManageControllerResponse as apiTextResponse } from "../../utils/static-response-message/index.js";
import generatePassword from "../../utils/password-generator/passwordGenerator.js";
import { getCentralDBModels } from "../../db/connectMongoDB.js";
import mongoose from "mongoose";

// const { Company, Idp_account } = await getCentralDBModels();

export async function registerService(value) {

    try {
        
        console.log("Company", Company)
        if(!Company || !Idp_account) throw new ApiErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Try again. failed to load models")
        /**
         * 01: First insert data in companies collection using Company Model
         * 02: Then insert data in idp collection using Idp Model.
         */
        // const newCompanyData = new Company(value);

        // console.log("getCentralDBModels", getCentralDBModels)
        const newCompanyData = new Company(value);
        if (value.database.backupEnabled === "Active") {
            newCompanyData.database.backupEnabled = true
        } else {
            newCompanyData.database.backupEnabled = false
        }
        const isDBNameExists = await Company.findOne({ "database.dbName": value.database.dbName })

        if (isDBNameExists) {
            newCompanyData.database.dbName = (value.companyName.split(" ")[0] + "_1" + "_db").toLowerCase()
            const resgiteredNewCompany = await newCompanyData.save();
            if (!resgiteredNewCompany) {
                throw new ApiErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, apiTextResponse.internalError)
            }
            // throw new ApiErrorResponse(StatusCodes.CONFLICT, apiTextResponse.dbNameExists ) 
        }

        // const newCompanyData = new Company(value);
        newCompanyData.database.dbName = (value.companyName.split(" ")[0] + "_db").toLowerCase()
        const resgiteredNewCompany = await newCompanyData.save();


        if (!resgiteredNewCompany) {
            throw new ApiErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, apiTextResponse.internalError)
        }

        const generatedPassword = generatePassword(10);

        console.log(`Password is ${generatedPassword}`);

        const isIdpAlreadyGenerated = await Idp_account.findOne({ username: (value?.admin?.email).toLowerCase() })
        console.log("isIdpAlreadyGenerated", isIdpAlreadyGenerated);

        /**
         * If isIdpAlreadyGenerated already exists, It means one account has multiple company or database
         * It means we need to assign only one idp for all db access
        */

        if (!isIdpAlreadyGenerated) {
            console.log("idp creation start")
            const newIdpData = new Idp_account({
                username: value.admin.email,
                password: generatedPassword,
                accountOwner: resgiteredNewCompany._id
            })
            const registeredIdp = await newIdpData.save();
            if (!registeredIdp) {
                throw new ApiErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, apiTextResponse.internalError)
            }
        }
        return resgiteredNewCompany;
    } catch (error) {
        console.log("error from service", error);
        throw error;
    }


}

export async function findService() {
    try {
        const { Company } = await getCentralDBModels();  // 🚀 Ensure connection
        
        if (!Company) {
            throw new ApiErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Try again. Failed to load models");
        }
        const companiesData = await Company.find().lean();
        if(!companiesData){
            throw new ApiErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to get Companies")
        }
        return companiesData;
    } catch (error) {
        console.log("error from find service", error)
        throw error
    }
}

export function switchCompanyWithDbNameService(company) {

}