import { StatusCodes } from "http-status-codes";
import { ApiErrorResponse, ApiSuccessResponse } from "../../utils/apiResponse/index.js";
import { validateRegisterCompanyModel } from "../../utils/validation/joi.js";
import { companyManageControllerResponse as apiTextResponse } from "../../utils/static-response-message/index.js";
import { v2CompanyManageService } from "../../services/index.js";
import { getCentralDBModels, getTenantDBModels } from "../../db/index.js";
import mongoose from "mongoose";

function assertSuperAdmin(user) {
    if (user?.users[0]["role"] !== "SuperAdmin") {
        throw new ApiErrorResponse(StatusCodes.FORBIDDEN, "SuperAdmin access required");
    }
}

function actorFromRequest(req) {
    const u0 = req.user?.users?.[0];
    return {
        userId: u0?._id ?? null,
        username: u0?.username ?? req.user?.username ?? "unknown",
        role: u0?.role ?? null,
    };
}

// For registering new company
export async function register(req, res, next) {
    try {
        const model = req.body;
        
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

// SuperAdmin company list: server-side pagination, sort, and filter
export async function find(req, res, next) {
    try {
        assertSuperAdmin(req.user);
        const {
            page = 1,
            pageSize = 25,
            search = "",
            status = "all",
            sortField = "companyName",
            sortOrder = "asc",
        } = req.query;
        const result = await v2CompanyManageService.findCompaniesPaginatedService({
            page: Number(page) || 1,
            pageSize: Number(pageSize) || 25,
            search: String(search),
            status: String(status),
            sortField: String(sortField),
            sortOrder: String(sortOrder),
        });
        return res.json(
            new ApiSuccessResponse({
                isSuccess: true,
                statusCode: StatusCodes.OK,
                message: apiTextResponse.findCompany,
                data: result.items,
                pageNo: result.page,
                pageSize: result.pageSize,
                totalCount: result.total,
            })
        );
    } catch (error) {
        next(error);
    }
}

export async function listStats(req, res, next) {
    try {
        assertSuperAdmin(req.user);
        const stats = await v2CompanyManageService.getCompanyListStatsService();
        return res.json(
            new ApiSuccessResponse({
                isSuccess: true,
                statusCode: StatusCodes.OK,
                message: "OK",
                data: stats,
            })
        );
    } catch (error) {
        next(error);
    }
}

export async function getById(req, res, next) {
    try {
        assertSuperAdmin(req.user);
        const { id } = req.params;
        const one = await v2CompanyManageService.getCompanyByIdService(id);
        return res.json(
            new ApiSuccessResponse({
                isSuccess: true,
                statusCode: StatusCodes.OK,
                message: "OK",
                data: one,
            })
        );
    } catch (error) {
        next(error);
    }
}

export async function updateById(req, res, next) {
    try {
        assertSuperAdmin(req.user);
        const { id } = req.params;
        const model = req.body;
        const { value, error } = validateRegisterCompanyModel(model);
        if (error) {
            throw new ApiErrorResponse(StatusCodes.BAD_REQUEST, error.details[0].message);
        }
        const updated = await v2CompanyManageService.updateCompanyByIdService(
            id,
            value,
            actorFromRequest(req)
        );
        return res.json(
            new ApiSuccessResponse(true, StatusCodes.OK, "Company updated", updated)
        );
    } catch (error) {
        next(error);
    }
}

export async function getUsage(req, res, next) {
    try {
        assertSuperAdmin(req.user);
        const { id } = req.params;
        const company = await v2CompanyManageService.getCompanyByIdService(id);
        const dbName = company?.database?.dbName;
        const usage = await v2CompanyManageService.getTenantUsageSnapshotService(dbName);
        return res.json(
            new ApiSuccessResponse({
                isSuccess: true,
                statusCode: StatusCodes.OK,
                message: "OK",
                data: usage,
            })
        );
    } catch (error) {
        next(error);
    }
}

export async function getTenantUsers(req, res, next) {
    try {
        assertSuperAdmin(req.user);
        const { id } = req.params;
        const company = await v2CompanyManageService.getCompanyByIdService(id);
        const dbName = company?.database?.dbName;
        const { page, pageSize, sortField, sortOrder } = req.query;
        const r = await v2CompanyManageService.getTenantUsersPageService(dbName, {
            page: Number(page) || 1,
            pageSize: Number(pageSize) || 25,
            sortField: String(sortField || "EmpName"),
            sortOrder: String(sortOrder || "asc"),
        });
        return res.json(
            new ApiSuccessResponse({
                isSuccess: true,
                statusCode: StatusCodes.OK,
                message: "OK",
                data: r.items,
                pageNo: r.page,
                pageSize: r.pageSize,
                totalCount: r.total,
            })
        );
    } catch (error) {
        next(error);
    }
}

export async function getTenantVehicles(req, res, next) {
    try {
        assertSuperAdmin(req.user);
        const { id } = req.params;
        const company = await v2CompanyManageService.getCompanyByIdService(id);
        const dbName = company?.database?.dbName;
        const { page, pageSize, sortField, sortOrder } = req.query;
        const r = await v2CompanyManageService.getTenantVehiclesPageService(dbName, {
            page: Number(page) || 1,
            pageSize: Number(pageSize) || 25,
            sortField: String(sortField || "VehicleNo"),
            sortOrder: String(sortOrder || "asc"),
        });
        return res.json(
            new ApiSuccessResponse({
                isSuccess: true,
                statusCode: StatusCodes.OK,
                message: "OK",
                data: r.items,
                pageNo: r.page,
                pageSize: r.pageSize,
                totalCount: r.total,
            })
        );
    } catch (error) {
        next(error);
    }
}

export async function getAuditLogs(req, res, next) {
    try {
        assertSuperAdmin(req.user);
        const { id } = req.params;
        const { page, pageSize } = req.query;
        const r = await v2CompanyManageService.getCompanyAuditLogPageService(id, {
            page: Number(page) || 1,
            pageSize: Number(pageSize) || 25,
        });
        return res.json(
            new ApiSuccessResponse({
                isSuccess: true,
                statusCode: StatusCodes.OK,
                message: "OK",
                data: r.items,
                pageNo: r.page,
                pageSize: r.pageSize,
                totalCount: r.total,
            })
        );
    } catch (error) {
        next(error);
    }
}

export async function bulkAction(req, res, next) {
    try {
        assertSuperAdmin(req.user);
        const { action, ids } = req.body || {};
        const result = await v2CompanyManageService.bulkCompanyActionService(
            String(action),
            Array.isArray(ids) ? ids : [],
            req.user
        );
        if (action === "export") {
            return res.json(
                new ApiSuccessResponse({
                    isSuccess: true,
                    statusCode: StatusCodes.OK,
                    message: "OK",
                    data: result,
                })
            );
        }
        return res.json(
            new ApiSuccessResponse({
                isSuccess: true,
                statusCode: StatusCodes.OK,
                message: "OK",
                data: result,
            })
        );
    } catch (error) {
        next(error);
    }
}

export async function remove(req, res, next) {
    try {
        assertSuperAdmin(req.user);
        const { id } = req.params;
        if (mongoose.Types.ObjectId.isValid(id)) {
            try {
                await v2CompanyManageService.logCompanyAuditEntry({
                    companyId: new mongoose.Types.ObjectId(id),
                    action: "deleted",
                    details: { source: "single" },
                    actor: actorFromRequest(req),
                });
            } catch (e) {
                console.warn("company audit (delete)", e?.message);
            }
        }
        const result = await v2CompanyManageService.deleteCompanyByIdService(id);
        return res.json(new ApiSuccessResponse(true, StatusCodes.OK, "Company removed", result));
    } catch (error) {
        next(error);
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
        next(error);
    }
}

export async function switchCompanyDatabaseWithDbName(req, res, next) {
    try {
        // const company = req.company;
        const { Idp_account, Company } = await getCentralDBModels();
       
        const { ownerId, adminName } = req.body; // Extract dbName from request

        const { database } = await Company.findOne({_id: ownerId}, {"database.dbName" : 1});

        console.log("database", database);
        if (!database?.dbName || !ownerId) {
            return next(new ApiErrorResponse(StatusCodes.BAD_REQUEST, "Database name && OwnerId are required"));
        }


        // const company = await Company.findById(ownerId);

        // if(!company){
        //     throw new ApiErrorResponse(StatusCodes.BAD_REQUEST, "Company not exists. Choose correct one.")
        // }
     
        // req.company = company;
       
        const idpAccount = await Idp_account.findOne({accountOwner: ownerId}, {users: {$slice: 1}, username: 1});
        
        // const adminUserName = adminName.split(" ")[0].toLowerCase();

        const username = idpAccount.users[0].username;
        // console.log("User from switch company", user);

        // const user = idpAccount.users.find((user) => user.username === adminUserName);
        // if(user.length !> 0){
        //     throw new ApiErrorResponse(StatusCodes.BAD_REQUEST, "User not found");
        // }
        await getTenantDBModels(database.dbName);

        console.log("new tenetdb connected", database.dbName);

        // if (!tenantDB) {
        //     throw new ApiErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, apiResponse.failedDbConnection)
        // }

        return res.status(StatusCodes.OK).json(new ApiSuccessResponse(true, StatusCodes.OK, `Connected to database: ${database.dbName}`, {
            navigateTo: "/home",
            username: username,
            dbName: database.dbName,
        }))
    } catch (error) {
        next(error);
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
