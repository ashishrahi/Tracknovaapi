import { StatusCodes } from "http-status-codes";
import { Company, Idp_account } from "../../modals/index.js";
import { ApiErrorResponse } from "../../utils/apiResponse/index.js";
import { companyManageControllerResponse as apiTextResponse } from "../../utils/static-response-message/index.js";
import generatePassword from "../../utils/password-generator/passwordGenerator.js";

export async function registerService(value){

    try {
        /**
         * 01: First insert data in companies collection using Company Model
         * 02: Then insert data in idp collection using Idp Model.
         */
        const newCompanyData = new Company(value);
        const isDBNameExists = await Company.findOne({ "database.dbName" : value.database.dbName })
        
        if(isDBNameExists){
            newCompanyData.database.dbName = (value.companyName.split(" ")[0]+ "_1" + "_db").toLowerCase()
            const resgiteredNewCompany = await newCompanyData.save();
            if(!resgiteredNewCompany){
                throw new ApiErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, apiTextResponse.internalError)
            }
            // throw new ApiErrorResponse(StatusCodes.CONFLICT, apiTextResponse.dbNameExists ) 
        }
    
        // const newCompanyData = new Company(value);
        newCompanyData.database.dbName = (value.companyName.split(" ")[0] + "_db").toLowerCase()
        const resgiteredNewCompany = await newCompanyData.save();

    
        if(!resgiteredNewCompany){
            throw new ApiErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, apiTextResponse.internalError)
        }

        const generatedPassword = generatePassword(10);

        console.log(`Password is ${generatedPassword}`);

        const isIdpAlreadyGenerated = await Idp_account.findOne({ username: (value?.admin?.email).toLowerCase()})
        console.log("isIdpAlreadyGenerated", isIdpAlreadyGenerated);

        /**
         * If isIdpAlreadyGenerated already exists, It means one account has multiple company or database
         * It means we need to assign only one idp for all db access
        */

        if(!isIdpAlreadyGenerated){
            console.log("idp creation start")
            const newIdpData = new Idp_account({
                username: value.admin.email,
                password: generatedPassword,
                accountOwner: resgiteredNewCompany._id
            })
            const registeredIdp = await newIdpData.save();
            if(!registeredIdp){
                throw new ApiErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, apiTextResponse.internalError)
            }
        }
        

        return resgiteredNewCompany;
    } catch (error) {
        throw error;
    }
    

}

export async function findService(){
    try {
        const companiesData = await Company.find().lean();
        return companiesData;
    } catch (error) {
        throw error
    }
}