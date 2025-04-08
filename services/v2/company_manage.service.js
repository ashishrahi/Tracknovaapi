import { StatusCodes } from "http-status-codes";
import fs from "fs";
// import { Company, Idp_account } from "../../modals/index.js";
import { ApiErrorResponse } from "../../utils/apiResponse/index.js";
import { companyManageControllerResponse as apiTextResponse } from "../../utils/static-response-message/index.js";
import generatePassword from "../../utils/password-generator/passwordGenerator.js";
import { getCentralDBModels } from "../../db/index.js";
import { connectTenantDB } from "../../db/connectMongoDB.js";
import { getTenantDBModels } from "../../db/index.js";
// import { RegisterQuery } from "../../utils/DBQueries/index.js";
import { EmpMasterController } from "../../controllers/index.js";
import { AddUpdateEmployeeQuery, UpsertEmpPermissionQuery } from "../../utils/DBQueries/index.js";
import EmpMaster from "../../modals/EmpMaster.model.js";
import sendMailService from "../../utils/emailService/nodeMailer.js";
import argon2 from "argon2";

//--------- registerService -------->
export async function registerService(value) {

    try {
        const { Company, Idp_account } = await getCentralDBModels();

        if (!Company || !Idp_account) throw new ApiErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Try again. failed to load models")
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

        // userName for Admin. It is also unique.
        const adminUserName = (value.admin.name.split(" ")[0] + "_admin").toLowerCase();
        const isIdpAlreadyGenerated = await Idp_account.findOne({ username: adminUserName });

        console.log("isIdpAlreadyGenerated", isIdpAlreadyGenerated);

        /**
         * If isIdpAlreadyGenerated already exists, It means one account has multiple company or database
         * It means we need to assign only one idp for all db access
        */

        if (!isIdpAlreadyGenerated) {
          
            const newIdpData = new Idp_account({
                username: newCompanyData.admin.email,
                /**
                 * we need to fetch same password as before and sent it  
                 * current generation again password and sent it
                 */
                password: generatedPassword,
                accountOwner: resgiteredNewCompany._id,
                users: [
                    {
                        username: adminUserName,
                        password: await argon2.hash(generatedPassword),
                        email: value.admin.email,
                        role: value.admin.role,
                    }
                ]
            })
            const registeredIdp = await newIdpData.save();
            if (!registeredIdp) {
                throw new ApiErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, apiTextResponse.internalError)
            }
        }

        // If isIdpAlreadyGenerated is true , It means this owner has a already company registed with us.



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

        await connectTenantDB(newCompanyData.database.dbName);
        const { Menu, AspNetRoles, RolePermission } = await getTenantDBModels();

        // const admin = await EmpMasterController.AddUpdateEmployee()

        const payload =
        {
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

        const { data } = await AddUpdateEmployeeQuery(payload); // Emp created
        // updating payload
        payload.empid = data.Empid;

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
        let to = "saurabhkushwaha9889@gmail.com";
        let subject = `👤 New User Added`
        let html = `
            <h2>👤 New User Added</h2>
            <p><strong>Username:</strong> ${adminUserName}</p>
            <p><strong>Password:</strong> ${generatedPassword}</p>
            <p><strong>Email:</strong> ${value.admin.email}</p>
            <p><strong>Role:</strong> ${value.admin.role}</p>
            <p>User has been successfully added to the account: <strong>${value.companyName}</strong></p>
        `;
        // let mailOption = {
        //   mailType: model.status, // it should be like immediately, schedules
        //   mailSendStartDate: model.fromDate,
        //   mailSendFinishDate: model.toDate,
        //   mailSendFinishTime: model.toTime,
        // };
        await sendMailService(from, to, subject, "I am text", html)

        
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
        if (!companiesData) {
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




