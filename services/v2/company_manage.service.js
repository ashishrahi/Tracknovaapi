import { StatusCodes } from "http-status-codes";
import fs from "fs";
// import { Company, Idp_account } from "../../modals/index.js";
import { ApiErrorResponse } from "../../utils/apiResponse/index.js";
import { companyManageControllerResponse as apiTextResponse } from "../../utils/static-response-message/index.js";
import generatePassword from "../../utils/password-generator/passwordGenerator.js";
import { getCentralDBModels, getTenantDBModels } from "../../db/index.js";
import { setRequestTenantDbName } from "../../db/tenantContext.js";
import { isValidTenantDatabaseName } from "../../db/connectMongoDB.js";
import { BRAND } from "../../config/brand.js";
// import { RegisterQuery } from "../../utils/DBQueries/index.js";
import { EmpMasterController } from "../../controllers/index.js";
import { AddUpdateEmployeeQuery, UpsertEmpPermissionQuery } from "../../utils/DBQueries/index.js";
import sendMailService from "../../utils/emailService/nodeMailer.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { ensureUniqueCompanyCode, ensureUniqueWorkspaceSlug } from "../../utils/companyIdentifiers.js";
import { buildTrackNovaSignInUsername, normalizeToLocalTenDigits } from "../../utils/trackNovaSignInUsername.js";

function escapeHtml(/** @type {string} */ s) {
    return String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

/**
 * @param {string} companyName
 * @returns {string} slug suitable as MongoDB database name prefix (1–64 chars for full name with suffix)
 */
function slugPrefixFromCompanyName(companyName) {
    const raw = (companyName && String(companyName).split(/\s+/)[0]) || "company";
    const cleaned = raw.replace(/[^a-zA-Z0-9_-]/g, "").toLowerCase();
    const base = cleaned.length > 0 ? cleaned : "company";
    return base.slice(0, 40);
}

/**
 * @param {import("mongoose").Model} Company
 * @param {string} companyName
 * @param {string | undefined} providedRaw
 */
async function resolveTenantDbName(Company, companyName, providedRaw) {
    const provided = typeof providedRaw === "string" ? providedRaw.trim() : "";
    if (provided) {
        const normalized = provided.toLowerCase();
        if (!isValidTenantDatabaseName(normalized)) {
            throw new ApiErrorResponse(
                StatusCodes.BAD_REQUEST,
                "Invalid database name. Use only letters, numbers, underscore, hyphen; max 64 characters."
            );
        }
        const taken = await Company.findOne({ "database.dbName": normalized });
        if (taken) {
            throw new ApiErrorResponse(StatusCodes.BAD_REQUEST, apiTextResponse.dbNameExists);
        }
        return normalized;
    }
    const prefix = slugPrefixFromCompanyName(companyName);
    for (let i = 0; i < 100; i++) {
        const candidate = i === 0 ? `${prefix}_db` : `${prefix}_${i}_db`;
        if (!isValidTenantDatabaseName(candidate)) {
            break;
        }
        const taken = await Company.findOne({ "database.dbName": candidate });
        if (!taken) {
            return candidate;
        }
    }
    const fallback = `${prefix}_${Date.now()}_db`.slice(0, 64);
    if (!isValidTenantDatabaseName(fallback)) {
        throw new ApiErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Could not allocate a database name");
    }
    const takenF = await Company.findOne({ "database.dbName": fallback });
    if (takenF) {
        throw new ApiErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Could not allocate a unique database name");
    }
    return fallback;
}

//--------- registerService -------->
export async function registerService(value) {

    try {
        const { Company, Idp_account } = await getCentralDBModels();

        if (!Company || !Idp_account) throw new ApiErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Try again. failed to load models")

        const adminEmailKey = (value.admin?.email && String(value.admin.email).toLowerCase().trim()) || "";
        if (adminEmailKey) {
            const idpForEmail = await Idp_account.findOne({ username: adminEmailKey });
            if (idpForEmail) {
                throw new ApiErrorResponse(
                    StatusCodes.CONFLICT,
                    "An account with this admin email already exists. Sign in, or use a different email to register a new company."
                );
            }
        }

        /**
         * Local/QA: force a single predictable workspace (companyName "testingCompany" → workspaceSlug "testingcompany").
         * Set REGISTRATION_DEMO_COMPANY=1 in .env to enable.
         */
        if (process.env.REGISTRATION_DEMO_COMPANY === "1" || process.env.REGISTRATION_DEMO_COMPANY === "true") {
            value.companyName = "testingCompany";
        }

        if (value.admin?.phone) {
            value.admin.phone = normalizeToLocalTenDigits(value.admin.phone);
        }
        if (value.companyPhone) {
            value.companyPhone = normalizeToLocalTenDigits(value.companyPhone) || value.companyPhone;
        }

        /**
         * 01: First insert data in companies collection using Company Model
         * 02: Then insert data in idp collection using Idp Model.
         */
        if (!value.database) {
            value.database = { backupEnabled: "Active" };
        }
        const newCompanyData = new Company(value);
        if (value.database.backupEnabled === "Active") {
            newCompanyData.database.backupEnabled = true
        } else {
            newCompanyData.database.backupEnabled = false
        }
        const resolvedDb = await resolveTenantDbName(Company, value.companyName, value.database?.dbName);
        newCompanyData.database.dbName = resolvedDb;
        // Downstream queries (e.g. AddUpdateEmployeeQuery) call getTenantDBModels() without a name and rely on request context.
        setRequestTenantDbName(resolvedDb);

        const resgiteredNewCompany = await newCompanyData.save();


        if (!resgiteredNewCompany) {
            throw new ApiErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, apiTextResponse.internalError)
        }

        const workspaceSlug = await ensureUniqueWorkspaceSlug(
            Company,
            value.companyName,
            resgiteredNewCompany._id
        );
        const companyCode = await ensureUniqueCompanyCode(
            Company,
            value.companyName,
            resgiteredNewCompany._id
        );
        const persisted = await Company.findByIdAndUpdate(
            resgiteredNewCompany._id,
            { $set: { workspaceSlug, companyCode } },
            { new: true, runValidators: true }
        );
        if (!persisted?.workspaceSlug || !persisted?.companyCode) {
            throw new ApiErrorResponse(
                StatusCodes.INTERNAL_SERVER_ERROR,
                "Failed to persist workspace or company code; try again."
            );
        }
        resgiteredNewCompany.workspaceSlug = persisted.workspaceSlug;
        resgiteredNewCompany.companyCode = persisted.companyCode;

        const generatedPassword = generatePassword(10);

        // userName for Admin: deterministic `firstName` (alnum) + last 4 digits of local mobile
        const adminUserName = buildTrackNovaSignInUsername(
            value.admin.name,
            value.admin.phone
        );

        const newIdpData = new Idp_account({
            username: newCompanyData.admin.email,
            password: generatedPassword,
            accountOwner: resgiteredNewCompany._id,
            users: [
                {
                    username: adminUserName,
                    password: bcrypt.hashSync(generatedPassword, 10),
                    email: value.admin.email,
                    role: value.admin.role,
                },
            ],
        });
        const registeredIdp = await newIdpData.save();
        if (!registeredIdp) {
            throw new ApiErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, apiTextResponse.internalError);
        }



        /**
         * Now creating a user to access Database
         * 1. Admin => username: admin
         *             password: admin
         * 2. Now giving him a full permissions in later update we will create a seprate permisison page to provide permissions.
         * 
         * 3. For Doing all these need to connect with database.
         * 
         * 
         * 
         */

        const { Menu, AspNetRoles, RolePermission } = await getTenantDBModels(
            newCompanyData.database.dbName
        );

        // const admin = await EmpMasterController.AddUpdateEmployee()

        const payload =
        {
            "__companyRegistration": true,
            "userId": null,
            "empid": 0, // will update inside query
            "empName": newCompanyData.admin.name,
            "empCode": "",
            "empPerAddress": newCompanyData.companyAddress,
            "empLocalAddress": newCompanyData.companyAddress,
            // "empFatherName": null,
            // "empspauseName": null,
            // "empMotherName": null,
            "empMobileNo": newCompanyData.admin.phone,
            "empStatus": "Active",
            "empPanNumber": newCompanyData.pan,
            "empAddharNo": newCompanyData.aadhaar,
            // "empDob": null,
            "empJoiningDate": Date.now(),
            // "empretirementDate": null,
            // "empDesignationId": null,
            // "empDeptId": null,
            "empStateId": newCompanyData.state,
            "empCountryID": newCompanyData.country,
            "empCityId": newCompanyData.city,
            "empPincode": newCompanyData.pincode,
            // "createdBy": null,
            // "updatedBy": null,
            "createdOn": "2025-04-01",
            "updatedOn": "2025-04-01",
            "roleId": "",
            "imageFile": "",
            "email": newCompanyData.admin.email,
            // "dlno": null,
            // "gender": null,
            // "departmentName": "",
            // "designationName": "",
            // "empStateName": "",
            // "empCountryName": "",
            // "empCityName": "",
            // "srno": 0,
            // "empDepName": "",
            // ---------For Login---------->
            "registerModel": {
                "id": "",
                "username": "",
                "email": "user@example.com",
                "password": "1234",
                "role": ""
            },
            "userPermission": []
        }

        const empResult = await AddUpdateEmployeeQuery(payload); // Emp created
        if (empResult?.isSuccess === false || (empResult?.mesg && !empResult?.data)) {
            throw new ApiErrorResponse(
                StatusCodes.BAD_REQUEST,
                String(empResult?.mesg || "Could not create company admin employee")
            );
        }
        if (!empResult?.data) {
            throw new ApiErrorResponse(
                StatusCodes.INTERNAL_SERVER_ERROR,
                "Employee creation returned no data"
            );
        }
        const createdEmp = empResult.data;
        const plain =
            createdEmp && typeof createdEmp.toObject === "function"
                ? createdEmp.toObject()
                : createdEmp;
        const newEmpid = plain?.Empid ?? plain?.empid;
        if (newEmpid == null) {
            throw new ApiErrorResponse(
                StatusCodes.INTERNAL_SERVER_ERROR,
                "Employee record is missing Empid"
            );
        }
        payload.empid = newEmpid;
        delete payload.__companyRegistration;

        // Inserting all menus to show sidebar and for permissions;
        const menuJsonData = JSON.parse(fs.readFileSync("./utils/db-default-data/Menu.json", "utf-8"));

        const menuResult = await Menu.insertMany(menuJsonData);
        if(menuResult.insertedCount < 1){
            throw new ApiErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to insert Menu data")
        }

        // Inserting Role name
        const roleObject = new AspNetRoles({
            Id : "e45b5e06-01bc-4881-b748-edf1cff433b3",
            Name: "Admin",
            NormalizedName: "ADMIN"
        });

        const roleName = await roleObject.save();
        if(!roleName){
            throw new ApiErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to insert Role data")
        }



        // Inserting Role's Related Permission;
        const rolePermissionJsonData = JSON.parse(fs.readFileSync("./utils/db-default-data/RolePermission.json", "utf-8"));

        const rolePermissionResult = await RolePermission.insertMany(rolePermissionJsonData);
        if(rolePermissionResult.insertedCount < 1){
            throw new ApiErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to insert Role's Permission");
        }

        // Now finally upserting data.
       
        payload.registerModel.username = adminUserName;
        payload.registerModel.password = generatedPassword;
        payload.registerModel.email = newCompanyData.admin.email;
        payload.userPermission = rolePermissionJsonData;
        payload.roleId = roleName.Id;

        // console.log("Payload resgister model is, payload", payload.registerModel);
        // console.log("Payload userPermisison is is, payload", payload.userPermission);

        // Upserting admin related permissions
        const upsertAdminPermissionAndCreatingAdminAccount = await UpsertEmpPermissionQuery(payload); 
        
        if(upsertAdminPermissionAndCreatingAdminAccount.status !== 1){
            throw new ApiErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to create admin and their permissions");
        }

        /**
         * Now send mail to newlu created user.
         */

        const from = process.env.NODEMAILER_EMAIL_USER;
        const to = value.admin.email;
        const subject = `Your ${BRAND.name} workspace is ready`;
        const textBody = `Your workspace is ready.

Sign-in username: ${adminUserName}
Temporary password: ${generatedPassword}

Use these on the ${BRAND.name} login page.`;
        const html = `
            <h2>Welcome to ${BRAND.name}</h2>
            <p>Your company workspace <strong>${escapeHtml(value.companyName)}</strong> is provisioned.</p>
            <p><strong>Sign-in username (use this on the login page):</strong> ${escapeHtml(adminUserName)}</p>
            <p><strong>Temporary password:</strong> ${escapeHtml(generatedPassword)}</p>
            <p>Sign in and complete setup. You can change your password from the app when available.</p>
            <p><small>Role: ${escapeHtml(String(value.admin.role))}</small></p>
        `;
        if (from) {
            await sendMailService(from, to, subject, textBody, html);
        } else {
            console.warn("registerService: NODEMAILER_EMAIL_USER not set; welcome email not sent");
        }

        const companyPlain = resgiteredNewCompany.toObject
            ? resgiteredNewCompany.toObject()
            : { ...resgiteredNewCompany };
        return {
            ...companyPlain,
            username: adminUserName,
            signInUsername: adminUserName,
            temporaryPassword: generatedPassword,
        };
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
        if (!companiesData) {
            throw new ApiErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to get Companies")
        }
        return companiesData;
    } catch (error) {
        console.log("error from find service", error)
        throw error
    }
}

/**
 * Super-admin: remove a company from the central directory and its IdP account row.
 * (Tenant DBs are not dropped; extend here if the product should cascade.)
 */
export async function deleteCompanyByIdService(companyId) {
    if (!mongoose.Types.ObjectId.isValid(companyId)) {
        throw new ApiErrorResponse(StatusCodes.BAD_REQUEST, "Invalid company id");
    }
    const { Company, Idp_account } = await getCentralDBModels();
    if (!Company || !Idp_account) {
        throw new ApiErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Try again. failed to load models");
    }
    const existing = await Company.findById(companyId);
    if (!existing) {
        throw new ApiErrorResponse(StatusCodes.NOT_FOUND, "Company not found");
    }
    await Idp_account.deleteMany({ accountOwner: companyId });
    await Company.findByIdAndDelete(companyId);
    return { _id: companyId };
}

/**
 * Super-admin: update a company in the central directory. Tenant `database.dbName` is immutable.
 */
export async function updateCompanyByIdService(companyId, value, actor) {
    if (!mongoose.Types.ObjectId.isValid(companyId)) {
        throw new ApiErrorResponse(StatusCodes.BAD_REQUEST, "Invalid company id");
    }
    const { Company } = await getCentralDBModels();
    if (!Company) {
        throw new ApiErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Try again. failed to load models");
    }
    const existing = await Company.findById(companyId);
    if (!existing) {
        throw new ApiErrorResponse(StatusCodes.NOT_FOUND, "Company not found");
    }
    const existingDbName = existing.database?.dbName;
    if (!existingDbName) {
        throw new ApiErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Company has no database name");
    }

    const data = { ...value };
    const backupRaw = value.database?.backupEnabled;
    const backupBool = backupRaw === "Active" || backupRaw === true;
    data.database = {
        ...value.database,
        dbName: existingDbName,
        backupEnabled: backupBool,
    };
    if (value.subscription) {
        const exSub = existing.subscription && typeof existing.subscription === "object"
            ? existing.subscription.toObject
                ? existing.subscription.toObject()
                : { ...existing.subscription }
            : {};
        data.subscription = {
            ...exSub,
            plan: value.subscription.plan,
            fromDate: new Date(value.subscription.fromDate),
            toDate: new Date(value.subscription.toDate),
            status: value.subscription.status,
        };
    }
    if (value.aadhaar != null && value.aadhaar !== "") {
        data.aadhaar = String(value.aadhaar).replace(/\D/g, "");
    }
    if (value.pan) {
        data.pan = String(value.pan).toUpperCase();
    }

    const updated = await Company.findByIdAndUpdate(
        companyId,
        { $set: data },
        { new: true, runValidators: true, context: "query" }
    ).lean();
    if (!updated) {
        throw new ApiErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Update failed");
    }
    const act = actor && typeof actor === "object" ? actor : getActorFromUserDoc(null);
    try {
        await logCompanyAuditEntry({
            companyId: new mongoose.Types.ObjectId(companyId),
            action: "updated",
            details: { fields: Object.keys(value) },
            actor: act,
        });
    } catch (e) {
        console.warn("company audit (update)", e?.message);
    }
    return getCompanyByIdService(companyId);
}

// -------- SaaS admin: audit, pagination, bulk, usage, trial --------

function getActorFromUserDoc(user) {
    if (!user) return { userId: null, username: "system", role: null };
    const u0 = user.users && user.users[0];
    return {
        userId: u0?._id ?? null,
        username: u0?.username ?? user.username ?? "unknown",
        role: u0?.role ?? null,
    };
}

/**
 * @param {import("mongoose").ClientSession} [session]
 */
export async function logCompanyAuditEntry({ companyId, action, details, actor }, session) {
    const { CompanyAuditLog } = await getCentralDBModels();
    if (!CompanyAuditLog) {
        return;
    }
    await CompanyAuditLog.create(
        [
            {
                companyId,
                action,
                details: details && typeof details === "object" ? details : { info: String(details) },
                performedBy: {
                    userId: actor.userId,
                    username: actor.username,
                    role: actor.role,
                },
            },
        ],
        session ? { session } : undefined
    );
}

const SUB_SORTABLE = {
    companyName: "companyName",
    companyEmail: "companyEmail",
    createdAt: "createdAt",
    subscriptionToDate: "subscription.toDate",
    subscriptionFromDate: "subscription.fromDate",
    subscriptionStatus: "subscription.status",
};

/**
 * @param {{ subscription?: { status?: string; toDate?: Date } }} doc
 */
function computeDisplayStatus(doc) {
    const sub = doc?.subscription;
    const s = sub?.status;
    const to = sub?.toDate ? new Date(sub.toDate) : null;
    if (s === "Pending") return "Pending";
    if (s === "Suspended") return "Suspended";
    if (s === "Expired") return "Trial Expired";
    if (s === "Active" && to && !isNaN(to.getTime()) && to < new Date()) return "Trial Expired";
    return "Active";
}

/**
 * @param {string} displayStatus
 * @param {Date} now
 * @returns {object} Mongo match fragment for subscription
 */
function matchForDisplayStatus(displayStatus, now) {
    if (!displayStatus || displayStatus === "all") {
        return {};
    }
    if (displayStatus === "Pending") {
        return { "subscription.status": "Pending" };
    }
    if (displayStatus === "Suspended") {
        return { "subscription.status": "Suspended" };
    }
    if (displayStatus === "Active") {
        return {
            "subscription.status": "Active",
            $or: [
                { "subscription.toDate": { $exists: false } },
                { "subscription.toDate": null },
                { "subscription.toDate": { $gte: now } },
            ],
        };
    }
    if (displayStatus === "Trial Expired" || displayStatus === "Expired") {
        return {
            $or: [
                { "subscription.status": "Expired" },
                {
                    $and: [
                        { "subscription.status": "Active" },
                        { "subscription.toDate": { $lt: now } },
                    ],
                },
            ],
        };
    }
    return {};
}

/**
 * @param {object} statusPart
 * @param {string} search
 * @returns {object}
 */
function buildCompanyListFilter(statusPart, search) {
    const s = (search && String(search).trim()) || "";
    const parts = [];
    if (statusPart && Object.keys(statusPart).length > 0) {
        parts.push(statusPart);
    }
    if (s) {
        const rx = new RegExp(s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
        parts.push({
            $or: [
                { companyName: rx },
                { companyEmail: rx },
                { companyPhone: rx },
                { "admin.name": rx },
            ],
        });
    }
    if (parts.length === 0) {
        return {};
    }
    if (parts.length === 1) {
        return parts[0];
    }
    return { $and: parts };
}

/**
 * @param {object} options
 * @param {string} [options.search]
 * @param {string} [options.status] display status
 * @param {number} [options.page]
 * @param {number} [options.pageSize]
 * @param {string} [options.sortField]
 * @param {string} [options.sortOrder] asc|desc
 */
export async function findCompaniesPaginatedService(options = {}) {
    const { Company } = await getCentralDBModels();
    if (!Company) {
        throw new ApiErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Try again. Failed to load models");
    }
    const now = new Date();
    const page = Math.max(1, Math.floor(Number(options.page) || 1));
    const pageSize = Math.min(200, Math.max(1, Math.floor(Number(options.pageSize) || 25)));
    const search = (options.search && String(options.search).trim()) || "";
    const status = (options.status && String(options.status)) || "all";
    const sortKey = options.sortField && SUB_SORTABLE[options.sortField] ? options.sortField : "companyName";
    const order = String(options.sortOrder || "asc").toLowerCase() === "desc" ? -1 : 1;
    const sortPath = SUB_SORTABLE[sortKey] || "companyName";

    const statusPart = matchForDisplayStatus(status, now);
    const q = buildCompanyListFilter(statusPart, search);
    const total = await Company.countDocuments(q);
    const sortSpec = { [sortPath]: order === 1 ? 1 : -1 };
    if (sortPath !== "createdAt") {
        sortSpec.createdAt = -1;
    }

    const skip = (page - 1) * pageSize;
    const raw = await Company.find(q)
        .sort(sortSpec)
        .skip(skip)
        .limit(pageSize)
        .lean();

    const items = raw.map((row) => {
        const fromDate = row.subscription?.fromDate
            ? new Date(row.subscription.fromDate).toISOString().split("T")[0]
            : "";
        const toDate = row.subscription?.toDate
            ? new Date(row.subscription.toDate).toISOString().split("T")[0]
            : "";
        return {
            ...row,
            fromDate,
            toDate,
            displayStatus: computeDisplayStatus(row),
            id: row._id,
        };
    });

    return { items, total, page, pageSize };
}

/**
 * Rollups for company list header widgets
 */
export async function getCompanyListStatsService() {
    const { Company } = await getCentralDBModels();
    if (!Company) {
        throw new ApiErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Try again. Failed to load models");
    }
    const all = await Company.find({}, { subscription: 1 }).lean();
    const now = new Date();
    const weekMs = 7 * 24 * 60 * 60 * 1000;
    let total = 0;
    let active = 0;
    let pending = 0;
    let suspended = 0;
    let trialExpired = 0;
    let expiring7d = 0;
    for (const row of all) {
        total += 1;
        const d = computeDisplayStatus(row);
        if (d === "Active") active += 1;
        if (d === "Pending") pending += 1;
        if (d === "Suspended") suspended += 1;
        if (d === "Trial Expired") trialExpired += 1;
        const to = row.subscription?.toDate ? new Date(row.subscription.toDate) : null;
        if (d === "Active" && to && to > now && to.getTime() - now.getTime() <= weekMs) {
            expiring7d += 1;
        }
    }
    return { total, active, pending, suspended, trialExpired, expiring7d };
}

export async function getCompanyByIdService(companyId) {
    if (!mongoose.Types.ObjectId.isValid(companyId)) {
        throw new ApiErrorResponse(StatusCodes.BAD_REQUEST, "Invalid company id");
    }
    const { Company } = await getCentralDBModels();
    const row = await Company.findById(companyId).lean();
    if (!row) {
        throw new ApiErrorResponse(StatusCodes.NOT_FOUND, "Company not found");
    }
    const fromDate = row.subscription?.fromDate
        ? new Date(row.subscription.fromDate).toISOString().split("T")[0]
        : "";
    const toDate = row.subscription?.toDate
        ? new Date(row.subscription.toDate).toISOString().split("T")[0]
        : "";
    return {
        ...row,
        fromDate,
        toDate,
        displayStatus: computeDisplayStatus(row),
        id: row._id,
    };
}

/**
 * @param {string} dbName
 */
export async function getTenantUsageSnapshotService(dbName) {
    if (!dbName) {
        return { userCount: 0, vehicleCount: 0, lastTrack: null, error: "no_db" };
    }
    try {
        const { EmpMaster, ItemMaster, NTCurrentDay } = await getTenantDBModels(dbName);
        const [userCount, vehicleCount, last] = await Promise.all([
            EmpMaster.countDocuments({}),
            ItemMaster.countDocuments({ ItemFlag: { $regex: /^V$/i } }),
            NTCurrentDay.findOne({}, { TrackTime: 1 }).sort({ TrackTime: -1 }).lean(),
        ]);
        return {
            userCount,
            vehicleCount,
            lastTrack: last?.TrackTime || null,
        };
    } catch (e) {
        console.warn("getTenantUsageSnapshotService", dbName, e?.message);
        return { userCount: 0, vehicleCount: 0, lastTrack: null, error: "tenant_unreachable" };
    }
}

/**
 * @param {string} dbName
 * @param {object} p
 */
export async function getTenantUsersPageService(dbName, p = {}) {
    const { EmpMaster } = await getTenantDBModels(dbName);
    const page = Math.max(1, Math.floor(Number(p.page) || 1));
    const pageSize = Math.min(100, Math.max(1, Math.floor(Number(p.pageSize) || 25)));
    const skip = (page - 1) * pageSize;
    const sortKey =
        p.sortField === "Empid" ? "Empid" : p.sortField === "email" || p.sortField === "Email" ? "Email" : "EmpName";
    const order = String(p.sortOrder || "asc").toLowerCase() === "desc" ? -1 : 1;
    const total = await EmpMaster.countDocuments({});
    const rows = await EmpMaster.find(
        {},
        { Empid: 1, EmpName: 1, Email: 1, EmpStatus: 1, EmpMobileNo: 1 }
    )
        .sort({ [sortKey]: order })
        .skip(skip)
        .limit(pageSize)
        .lean();
    return { items: rows, total, page, pageSize };
}

/**
 * @param {string} dbName
 * @param {object} p
 */
export async function getTenantVehiclesPageService(dbName, p = {}) {
    const { ItemMaster } = await getTenantDBModels(dbName);
    const page = Math.max(1, Math.floor(Number(p.page) || 1));
    const pageSize = Math.min(100, Math.max(1, Math.floor(Number(p.pageSize) || 25)));
    const skip = (page - 1) * pageSize;
    const sortKey = p.sortField === "VehicleNo" ? "VehicleNo" : p.sortField === "ItemName" ? "ItemName" : "VehicleNo";
    const order = String(p.sortOrder || "asc").toLowerCase() === "desc" ? -1 : 1;
    const flt = { ItemFlag: { $regex: /^V$/i } };
    const total = await ItemMaster.countDocuments(flt);
    const rows = await ItemMaster.find(flt, {
        ItemName: 1,
        VehicleNo: 1,
        devid: 1,
        ZoneName: 1,
        ItemMasterId: 1,
    })
        .sort({ [sortKey]: order })
        .skip(skip)
        .limit(pageSize)
        .lean();
    return { items: rows, total, page, pageSize };
}

export async function getCompanyAuditLogPageService(companyId, p = {}) {
    if (!mongoose.Types.ObjectId.isValid(companyId)) {
        throw new ApiErrorResponse(StatusCodes.BAD_REQUEST, "Invalid company id");
    }
    const { CompanyAuditLog } = await getCentralDBModels();
    if (!CompanyAuditLog) {
        return { items: [], total: 0, page: 1, pageSize: 25 };
    }
    const page = Math.max(1, Math.floor(Number(p.page) || 1));
    const pageSize = Math.min(100, Math.max(1, Math.floor(Number(p.pageSize) || 25)));
    const skip = (page - 1) * pageSize;
    const q = { companyId: new mongoose.Types.ObjectId(companyId) };
    const total = await CompanyAuditLog.countDocuments(q);
    const items = await CompanyAuditLog.find(q)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean();
    return { items, total, page, pageSize };
}

/**
 * @param {string} action
 * @param {import("mongoose").Types.ObjectId[]} ids
 * @param {object} user - req.user
 */
export async function bulkCompanyActionService(action, ids, user) {
    if (!["activate", "suspend", "delete", "export"].includes(action)) {
        throw new ApiErrorResponse(StatusCodes.BAD_REQUEST, "Invalid bulk action");
    }
    const cleanIds = (ids || []).map((i) => String(i).trim()).filter((i) => mongoose.Types.ObjectId.isValid(i));
    if (!cleanIds.length) {
        throw new ApiErrorResponse(StatusCodes.BAD_REQUEST, "No company ids");
    }
    const actor = getActorFromUserDoc(user);
    const { Company, CompanyAuditLog } = await getCentralDBModels();
    if (!Company) {
        throw new ApiErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Try again. failed to load models");
    }
    if (action === "export") {
        const oids = cleanIds.map((i) => new mongoose.Types.ObjectId(i));
        const docs = await Company.find({ _id: { $in: oids } }).lean();
        if (CompanyAuditLog) {
            try {
                await logCompanyAuditEntry(
                    {
                        companyId: oids[0],
                        action: "bulk_export",
                        details: { idCount: oids.length, ids: cleanIds },
                        actor,
                    }
                );
            } catch (e) {
                console.warn("audit bulk_export", e?.message);
            }
        }
        return { action: "export", companies: docs };
    }
    if (action === "delete") {
        for (const id of cleanIds) {
            if (CompanyAuditLog) {
                try {
                    await logCompanyAuditEntry({
                        companyId: new mongoose.Types.ObjectId(id),
                        action: "deleted",
                        details: { source: "bulk" },
                        actor,
                    });
                } catch (e) {
                    console.warn("audit delete", e?.message);
                }
            }
            await deleteCompanyByIdService(id);
        }
        return { action: "delete", count: cleanIds.length };
    }
    if (action === "activate") {
        await Company.updateMany(
            { _id: { $in: cleanIds } },
            { $set: { "subscription.status": "Active" } }
        );
        for (const id of cleanIds) {
            if (CompanyAuditLog) {
                try {
                    await logCompanyAuditEntry({
                        companyId: new mongoose.Types.ObjectId(id),
                        action: "status_activated",
                        details: { source: "bulk" },
                        actor,
                    });
                } catch (e) {
                    console.warn("audit activate", e?.message);
                }
            }
        }
        return { action: "activate", count: cleanIds.length };
    }
    if (action === "suspend") {
        await Company.updateMany(
            { _id: { $in: cleanIds } },
            { $set: { "subscription.status": "Suspended" } }
        );
        for (const id of cleanIds) {
            if (CompanyAuditLog) {
                try {
                    await logCompanyAuditEntry({
                        companyId: new mongoose.Types.ObjectId(id),
                        action: "status_suspended",
                        details: { source: "bulk" },
                        actor,
                    });
                } catch (e) {
                    console.warn("audit suspend", e?.message);
                }
            }
        }
        return { action: "suspend", count: cleanIds.length };
    }
    return { action, count: 0 };
}

/**
 * Sets subscription to Expired when the end date is in the past (trial or any plan) or Trial plan with elapsed period.
 * Run periodically.
 */
export async function processSubscriptionExpiryService() {
    const { Company } = await getCentralDBModels();
    if (!Company) {
        return { updated: 0 };
    }
    const now = new Date();
    const r = await Company.updateMany(
        {
            "subscription.status": "Active",
            "subscription.toDate": { $lt: now },
        },
        { $set: { "subscription.status": "Expired" } }
    );
    return { updated: r.modifiedCount || r.nModified || 0 };
}

export function switchCompanyWithDbNameService(company) {

}




