import { StatusCodes } from "http-status-codes";
import { ApiErrorResponse, ApiSuccessResponse } from "../../utils/apiResponse/index.js";
import { validateRegisterCompanyModel } from "../../utils/validation/joi.js";
import { companyManageControllerResponse as apiTextResponse } from "../../utils/static-response-message/index.js";
import { v2CompanyManageService } from "../../services/index.js";
import { connectTenantDB } from "../../db/connectMongoDB.js";
import { getCentralDBModels } from "../../db/index.js";

import loadTenantModels from "../../utils/tenant-models/loadTenantModels.js";
// For registering new company
export async function register(req, res, next) {
    try {
        const model = req.body;
        console.log("Model is for", model)
        const { value, error } = validateRegisterCompanyModel(model);

        if (error) {
            throw new ApiErrorResponse(StatusCodes.BAD_REQUEST, error.details[0].message);
        }

        const resgiteredNewCompany = await v2CompanyManageService.registerService(value)

        return res.status(StatusCodes.OK).json(new ApiSuccessResponse(true, StatusCodes.OK, apiTextResponse.companycreated, resgiteredNewCompany))

    } catch (error) {
        console.log("error from controller", error)
        next(error);
    }
}

// For getting all new company
export async function find(req, res, next) {
    try {
        const user = req.user;
        if(user?.users[0]["role"] !== "SuperAdmin"){
            throw new ApiErrorResponse(StatusCodes.BAD_REQUEST, "You are not allowed to get company data")
        }
        const companies = await v2CompanyManageService.findService();
        return res.json(new ApiSuccessResponse(true, StatusCodes.OK, apiTextResponse.findCompany, companies))

    } catch (error) {
        throw error;
    }

}

// For switching company database.
export async function switchCompanyDatabase(req, res, next) {
    try {
        return res.json({
            message: `Switched to ${req.company.dbName}`,
            redirect: "/home",
        });
    } catch (error) {
        throw error;
    }
}

export async function switchCompanyDatabaseWithDbName(req, res, next) {
    try {
        // const company = req.company;
        const { Idp_account, Company } = await getCentralDBModels()
        const { dbName, ownerId, adminName } = req.body; // Extract dbName from request

        if (!dbName || !ownerId) {
            next(new ApiErrorResponse(StatusCodes.BAD_REQUEST, "Database name && OwnerId are required"));
            // return res.status(400).json({ message: "Database name is required" });
        }

        // const company = await Company.findById(ownerId);

        // if(!company){
        //     throw new ApiErrorResponse(StatusCodes.BAD_REQUEST, "Company not exists. Choose correct one.")
        // }
     
        // req.company = company;
       
        const idpAccount = await Idp_account.findOne({accountOwner: ownerId});
        

        const adminUserName = adminName.split(" ")[0].toLowerCase();

        const user = idpAccount.users.find((user) => user.username === (adminUserName + "_admin"));
        if(!user){
            throw new ApiErrorResponse(StatusCodes.BAD_REQUEST, "User not found");
        }

        const tenantDB = await connectTenantDB(dbName);

        console.log("new tenetdb connected", tenantDB);

        if (!tenantDB) {
            throw new ApiErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, apiResponse.failedDbConnection)
        }

        return res.status(StatusCodes.OK).json(new ApiSuccessResponse(true, StatusCodes.OK, `Connected to database: ${dbName}`, {
            navigateTo: "/home",
            username: user.username,
            dbName: dbName,
        }))
    } catch (error) {
        throw error;
    }
}



// try {
//     const company = req.company;
//     console.log("company is", company);

//     if (!company) {
//         next(new ApiErrorResponse(StatusCodes.UNAUTHORIZED, "Please Login"));
//     }

//     //  if(company && company.admin.role === "SuperAdmin"){
//     //     return new ApiSuccessResponse(true, StatusCodes.OK, "Login Successfull", { redirect: "/company", message: "Super Admin Dashboard" } )
//     //  }

//     console.log("company from switchdatabase", company)
//     const { database } = company;
//     console.log("databse from switchdatabase", database)
//     // If already connected, attach it to the request
//     if (connections[database.dbName]) {
//         req.db = connections[dbName];
//         return next();
//     }

//     // Create a new connection if not already established
//     const db = mongoose.createConnection(`${process.env.MONGODB_SERVER_URI}/${database.dbName}`);

//     if (!db) {
//         throw new ApiErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, apiResponse.failedDbConnection)
//     }

//     connections[database.dbName] = db;
//     req[database.dbName] = db;

//     console.log(`🔹 Connected to database: ${database.dbName}`);
//     next();
// } catch (error) {
//     console.error("Database switching error:", error);
//     return res.status(500).json({ message: "Error switching database", error });
// }
