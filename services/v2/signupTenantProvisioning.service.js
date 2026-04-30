import fs from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { StatusCodes } from "http-status-codes";
import { ApiErrorResponse } from "../../utils/apiResponse/index.js";
import { getTenantDBModels } from "../../db/index.js";
import { AddUpdateEmployeeQuery, UpsertEmpPermissionQuery } from "../../utils/DBQueries/index.js";
import sendMailService from "../../utils/emailService/nodeMailer.js";
import { BRAND } from "../../config/brand.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MENU_JSON_PATH = join(__dirname, "../../utils/db-default-data/Menu.json");
const ROLE_PERMISSION_JSON_PATH = join(__dirname, "../../utils/db-default-data/RolePermission.json");

const ADMIN_ROLE_ID = "e45b5e06-01bc-4881-b748-edf1cff433b3";

function escapeHtml(/** @type {string} */ s) {
    return String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

/**
 * Seeds tenant DB (menus, roles, permissions), creates admin employee + AspNet user, sends welcome mail.
 * Call only after central `Company` + `Idp_account` exist. Requires AsyncLocalStorage tenant context (`setRequestTenantDbName`).
 *
 * Idempotent when the tenant AspNetUsers row already exists for `adminUserName`.
 *
 * @param {object} p
 * @param {Record<string, any>} p.company - Company doc (Plain / lean) with admin, database.dbName
 * @param {string} p.adminUserName - Sign-in username (embedded IdP user)
 * @param {string} p.adminTemporaryPassword - Plain temp password shown to operator (AspNet PasswordHash legacy field)
 */
export async function runSignupTenantProvisioning({ company, adminUserName, adminTemporaryPassword }) {
    const dbName = company?.database?.dbName;
    if (!dbName || typeof adminUserName !== "string" || !adminUserName.trim()) {
        throw new ApiErrorResponse(StatusCodes.BAD_REQUEST, "Invalid provisioning context");
    }
    if (!adminTemporaryPassword || typeof adminTemporaryPassword !== "string") {
        throw new ApiErrorResponse(StatusCodes.BAD_REQUEST, "Missing admin temporary password");
    }

    const { AspNetUsers, EmpMaster, Menu, AspNetRoles, RolePermission } = await getTenantDBModels(dbName);

    const existingTenantUser = await AspNetUsers.findOne({ UserName: adminUserName }).lean();
    if (existingTenantUser) {
        console.log(`[signup-tenant-provisioning] skip: AspNetUsers already provisioned (${dbName})`);
        return;
    }

    const menuJsonData = JSON.parse(fs.readFileSync(MENU_JSON_PATH, "utf-8"));
    const rolePermissionJsonData = JSON.parse(fs.readFileSync(ROLE_PERMISSION_JSON_PATH, "utf-8"));

    const payload = {
        __companyRegistration: true,
        userId: null,
        empid: 0,
        empName: company.admin.name,
        empCode: "",
        empPerAddress: company.companyAddress,
        empLocalAddress: company.companyAddress,
        empMobileNo: company.admin.phone,
        empStatus: "Active",
        empPanNumber: company.pan,
        empAddharNo: company.aadhaar,
        empJoiningDate: Date.now(),
        empStateId: company.state,
        empCountryID: company.country,
        empCityId: company.city,
        empPincode: company.pincode,
        createdOn: "2025-04-01",
        updatedOn: "2025-04-01",
        roleId: "",
        imageFile: "",
        email: company.admin.email,
        registerModel: {
            id: "",
            username: "",
            email: "user@example.com",
            password: "1234",
            role: "",
        },
        userPermission: [],
    };

    let newEmpid;

    const existingByEmail = await EmpMaster.findOne({ Email: company.admin.email }).lean();
    if (existingByEmail) {
        newEmpid = existingByEmail.Empid;
    } else {
        const empResult = await AddUpdateEmployeeQuery(payload);
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
            createdEmp && typeof createdEmp.toObject === "function" ? createdEmp.toObject() : createdEmp;
        newEmpid = plain?.Empid ?? plain?.empid;
    }

    if (newEmpid == null) {
        throw new ApiErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Employee record is missing Empid");
    }

    payload.empid = newEmpid;
    delete payload.__companyRegistration;

    if ((await Menu.countDocuments()) === 0) {
        const menuResult = await Menu.insertMany(menuJsonData);
        if (!menuResult || menuResult.length < 1) {
            throw new ApiErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to insert Menu data");
        }
    }

    let roleDoc = await AspNetRoles.findOne({ Id: ADMIN_ROLE_ID }).lean();
    if (!roleDoc) {
        const roleObject = new AspNetRoles({
            Id: ADMIN_ROLE_ID,
            Name: "Admin",
            NormalizedName: "ADMIN",
        });
        const saved = await roleObject.save();
        if (!saved) {
            throw new ApiErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to insert Role data");
        }
        roleDoc =
            typeof saved.toObject === "function" ? saved.toObject() : saved;
    }

    if ((await RolePermission.countDocuments()) === 0) {
        const rolePermissionResult = await RolePermission.insertMany(rolePermissionJsonData);
        if (!rolePermissionResult || rolePermissionResult.length < 1) {
            throw new ApiErrorResponse(
                StatusCodes.INTERNAL_SERVER_ERROR,
                "Failed to insert Role's Permission"
            );
        }
    }

    payload.registerModel.username = adminUserName;
    payload.registerModel.password = adminTemporaryPassword;
    payload.registerModel.email = company.admin.email;
    payload.registerModel.role = company.admin.role || "Admin";
    payload.userPermission = rolePermissionJsonData;
    payload.roleId = roleDoc.Id;

    const upsertAdminPermissionAndCreatingAdminAccount = await UpsertEmpPermissionQuery(payload);
    if (upsertAdminPermissionAndCreatingAdminAccount.status !== 1) {
        throw new ApiErrorResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            "Failed to create admin and their permissions"
        );
    }

    const from = process.env.NODEMAILER_EMAIL_USER;
    const to = company.admin.email;
    const subject = `Your ${BRAND.name} workspace is ready`;
    const textBody = `Your workspace is ready.

Sign-in username: ${adminUserName}
Temporary password: ${adminTemporaryPassword}

Use these on the ${BRAND.name} login page.`;
    const html = `
            <h2>Welcome to ${BRAND.name}</h2>
            <p>Your company workspace <strong>${escapeHtml(company.companyName)}</strong> is provisioned.</p>
            <p><strong>Sign-in username (use this on the login page):</strong> ${escapeHtml(adminUserName)}</p>
            <p><strong>Temporary password:</strong> ${escapeHtml(adminTemporaryPassword)}</p>
            <p>Sign in and complete setup. You can change your password from the app when available.</p>
            <p><small>Role: ${escapeHtml(String(company.admin.role))}</small></p>
        `;
    if (from) {
        await sendMailService(from, to, subject, textBody, html);
    } else {
        console.warn("[signup-tenant-provisioning] NODEMAILER_EMAIL_USER not set; welcome email not sent");
    }
}
