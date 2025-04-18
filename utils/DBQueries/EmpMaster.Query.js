import { AspNetUsers, EmpMaster, UserPermission } from "../../modals/index.js";
import { StatusCodes } from "http-status-codes";
import { ApiErrorResponse } from "../apiResponse/index.js";
import { AuthController } from "../../controllers/index.js";
import {
  AddUpdateUserPermissionMasterQuery,
  RegisterQuery,
} from "../DBQueries/Auth.Query.js";
import { getCentralDBModels, getTenantDBModels } from "../../db/index.js";
import mongoose from "mongoose";
import argon2 from "argon2";
import sendMailService from "../emailService/nodeMailer.js";
//---------AddUpdateEmployeeQuery------>

export const AddUpdateEmployeeQuery = async (model) => {
  try {
    const { EmpMaster } = await getTenantDBModels();

    let response = {};

    // Check if Employee Exists
    const existingEmployee = await EmpMaster.findOne(
      { EmpName: model.empName, EmpMobileNo: model.empMobileNo }
      // null,
      // { session }
    );

    // Preparing correct format;
    const correctKeys = Object.keys(model).map(
      (key) => key.charAt(0).toUpperCase() + key.slice(1)
    );
    const validFormedData = {};

    for (const value of correctKeys) {
      console.log("Value for employee", value);
      // console.log("model", model)
      if (value === "Dlno") {
        validFormedData["DLNo"] =
          value && model[value?.charAt(0).toLowerCase() + value?.slice(1)];
      } else {
        validFormedData[value] =
          value && model[value?.charAt(0).toLowerCase() + value?.slice(1)];
      }
    }

    if (!model.empid || model.empid === 0) {
      if (existingEmployee) {
        throw new ApiErrorResponse(
          StatusCodes.BAD_REQUEST,
          "Record Already Exists!"
        );
      }

      const lastEmployee = await EmpMaster.findOne().sort({ Empid: -1 });
      // .session(session);

      validFormedData.Empid = (lastEmployee?.Empid || 0) + 1;
      // validFormedData.UserId = crypto.randomUUID();

      // Insert New Employee
      const newUser = await new EmpMaster(validFormedData).save();
      if (!newUser) {
        // const error = new Error("Failed to create new employee");
        // error.status = StatusCodes.INTERNAL_SERVER_ERROR;
        // return next(error);
        throw new ApiErrorResponse(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Failed to create employee"
        );
      }

      response.data = newUser;
      response.message = "Employee Successfully Added";
    } else {
      // Update Existing Employee
      console.log("validFormedData", validFormedData);
      const updatedEmp = await EmpMaster.updateOne(
        { Empid: model.empid },
        { $set: validFormedData }
      );
      if (!updatedEmp.acknowledged) {
        throw new ApiErrorResponse(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Failed to update the Employee. Try again!"
        );
      }
      if (updatedEmp.modifiedCount < 1) {
        throw new ApiErrorResponse(
          StatusCodes.BAD_REQUEST,
          "Employee may not exists."
        );
      }

      response.message = "Employee Successfully Updated";
    }

    return response;
  } catch (error) {
    throw error;
  }
};

//---------ImportEmployeeQuery------>

export const ImportEmployeeQuery = async (model) => {
  // try {
  //   const { EmpMaster, Department, Designation,CountryMaster } = await getTenantDBModels();
  //   let skipped = 0;
  //   let isInserted = 0;
  //   for (const employee of model) {
  //     // Employee exist or not
  //     const existing = await EmpMaster.findOne({ EmpName: empName });
  //     if (existing) {
  //       continue;
  //     }
  //     // Department exist to get DepartmentId
  //     const department = await Department.findOne({ DepartmentName: model.empDeptName});
  //     //  Designation Exist to get DesignationId
  //     const designation = await Designation.findOne({DesignationName: model.designationName});
  //     // Country exist get CountryId
  //     const country = await CountryMaster.findOne({CountryName:model.empCountryName})
     

  //   }
  // } catch (error) {
  //   console.log("error:", error);
  // }
};

//---------GetEmployeeQuery------>

export const GetEmployeeQuery = async (model) => {
  try {
    const { EmpMaster } = await getTenantDBModels();
    let { pageNo = 1, pageSize = 10 } = model;
    const skip = (pageNo = 1 - 1) * pageSize; // Calculate skip dynamically
    const employees = await EmpMaster.aggregate([
      {
        $lookup: {
          from: "Department",
          localField: "EmpDeptId",
          foreignField: "DepartmentId",
          as: "Department",
        },
      },
      {
        $unwind: {
          path: "$Department",
          preserveNullAndEmptyArrays: true,
        },
      },
      // Lookup Designation
      {
        $lookup: {
          from: "Designation",
          localField: "EmpDesignationId",
          foreignField: "DesignationId",
          as: "Designation",
        },
      },
      {
        $unwind: {
          path: "$Designation",
          preserveNullAndEmptyArrays: true,
        },
      },
      // Lookup State
      {
        $lookup: {
          from: "StateMaster",
          localField: "EmpStateId",
          foreignField: "StateId",
          as: "State",
        },
      },
      {
        $unwind: {
          path: "$State",
          preserveNullAndEmptyArrays: true,
        },
      },
      // Lookup Country
      {
        $lookup: {
          from: "CountryMaster",
          localField: "EmpCountryID",
          foreignField: "CountryId",
          as: "Country",
        },
      },
      {
        $unwind: {
          path: "$Country",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "CityMaster",
          localField: "EmpCityId",
          foreignField: "CityId",
          as: "City",
        },
      },
      {
        $unwind: {
          path: "$City",
          preserveNullAndEmptyArrays: true,
        },
      },
      // Project required fields
      {
        $project: {
          empid: "$Empid",
          empName: {
            $ifNull: ["$EmpName", ""],
          },
          empCode: "$EmpCode",
          empPerAddress: "$EmpPerAddress",
          empLocalAddress: "$EmpLocalAddress",
          empFatherName: "$EmpFatherName",
          empspauseName: "$EmpspauseName",
          empMotherName: "$EmpMotherName",
          empMobileNo: "$EmpMobileNo",
          empStatus: "$EmpStatus",
          empPanNumber: "$EmpPanNumber",
          empAddharNo: "$EmpAddharNo",
          empDob: "$EmpDob",
          empJoiningDate: "$EmpJoiningDate",
          empretirementDate: "$Empretimirement",
          empDesignationId: "$EmpDesignationId",
          empDeptId: "$EmpDeptId",
          empStateId: "$EmpStateId",
          empCountryID: "$EmpCountryID",
          empCityId: "$EmpCityId",
          empPincode: "$EmpPincode",
          createdBy: "$CreatedBy",
          updatedBy: "$updatedBy",
          createdOn: "$CreatedOn",
          updatedOn: "$UpdatedOn",
          userId: "$UserId",
          roleId: "$RoleId",
          // imageFile: "$Image",
          // signatureFile: "$SignatureFile",
          email: "$Email",
          dlno: "$DLNo",
          gender: "$Gender",
          departmentName: "$Department.DepartmentName",
          designationName: "$Designation.DesignationName",
          empStateName: "$State.StateName",
          empCountryName: "$Country.CountryName",
          empCityName: "$City.CityName",
          srno: "$Srno",
          empDepName: "$Department.DepartmentName",
        },
      },
    ]);
    const response = {
      status: 1,
      message: "Employees data fetched successfully",
      data: employees,
      pageNo: pageNo,
      pageSize: pageSize,
      rowCount: employees.length,
    };
    return response;
  } catch (error) {
    throw new ApiErrorResponse(StatusCodes.BAD_REQUEST, error.message);
  }
};

/////////////////////////////////////////////// UpsertEmpPermissionQuery //////////////////////////////////////////////////////////////////

export const UpsertEmpPermissionQuery = async (model, res, company) => {
  let response = { status: "Failed", message: "" };
  try {
    const { EmpMaster, UserPermission } = await getTenantDBModels();

    // If UserId is empty or null, register the user first
    model.registerModel.id = crypto.randomUUID();

    // if userId is not given register first user
    if (!model.userId) {
      console.log(" first if block executed");
      const { registerModel, userId, roleId } = model;
      // console.table({ registerModel, userId, roleId });

      if (model.registerModel?.username?.trim() === "") {
        throw new ApiErrorResponse(
          StatusCodes.BAD_REQUEST,
          "Please provide valid username"
        );
      }
      if (model.registerModel?.password === "") {
        throw new ApiErrorResponse(
          StatusCodes.BAD_REQUEST,
          "Please provide valid password"
        );
      }
      // it register user in AspNetUsers Table
      // if(model.registerModel?.username.trim() === ""){
      //   throw new ApiErrorResponse(StatusCodes.BAD_REQUEST, "Please provide valid Username or UserId")
      // }
      // model.registerModel.id  =====> Crypto UUID
      const newAspUser = await RegisterQuery(model.registerModel, res);

      if (!newAspUser)
        return response
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json(
            new ApiErrorResponse(
              StatusCodes.INTERNAL_SERVER_ERROR,
              "Failed to create a request. Try Again!!"
            )
          );

      model.userPermission.forEach(
        (perm) => (perm.userId = model.registerModel.id)
      );

      // Upsert User Permissions
      const upsertResponse = await AddUpdateUserPermissionMasterQuery(
        model.registerModel.id,
        model.userPermission
      );
      if (upsertResponse.isSuccess === false)
        throw new ApiErrorResponse(
          StatusCodes.BAD_REQUEST,
          upsertResponse.message
        );

      const { Idp_account } = await getCentralDBModels();

      console.log("company is", company);

      const newUser = {
        username: model.registerModel?.username?.trim(),
        password: await argon2.hash(model.registerModel?.password?.trim()),
        email: model.registerModel?.email,
        role: model.registerModel?.role,
        _id: new mongoose.Types.ObjectId(), // generating ObjectId manually
      };

      if (company && company !== "SuperAdmin") {
        const isInserted = await Idp_account.findOneAndUpdate(
          { accountOwner: company._id },
          {
            $push: { users: newUser },
          }
        );

        /**
         * Infor the user
         */
        const from = process.env.NODEMAILER_EMAIL_USER;
        let to = "saurabhkushwaha9889@gmail.com";
        let subject = `<h2>👤 New User Added</h2>`;
        let html = `
        <h2>👤 New User Added</h2>
        <p><strong>Username:</strong> ${newUser.username}</p>
        <p><strong>Username:</strong> ${model?.registerModel?.password}</p>
        <p><strong>Email:</strong> ${newUser.email}</p>
        <p><strong>Role:</strong> ${newUser.role}</p>
        <p>User has been successfully added to the account: <strong>${
          model?.companyName || "New Company"
        }</strong></p>
      `;
        // let mailOption = {
        //   mailType: model.status, // it should be like immediately, schedules
        //   mailSendStartDate: model.fromDate,
        //   mailSendFinishDate: model.toDate,
        //   mailSendFinishTime: model.toTime,
        // };
        await sendMailService(from, to, subject, "I am text", html);
      }

      const from = process.env.NODEMAILER_EMAIL_USER;
      let to = "saurabhkushwaha9889@gmail.com";
      let subject = `<h2>👤 New User Added</h2>`;
      let html = `
        <h2>👤 New User Added</h2>
        <p><strong>Username:</strong> ${newUser.username}</p>
        <p><strong>Username:</strong> ${model.registerModel?.password}</p>
        <p><strong>Email:</strong> ${newUser.email}</p>
        <p><strong>Role:</strong> ${newUser.role}</p>
        <p>User has been successfully added to the account: <strong>${
          model?.companyName || "New Company"
        }</strong></p>
      `;
      // let mailOption = {
      //   mailType: model.status, // it should be like immediately, schedules
      //   mailSendStartDate: model.fromDate,
      //   mailSendFinishDate: model.toDate,
      //   mailSendFinishTime: model.toTime,
      // };
      await sendMailService(from, to, subject, "I am text", html);
    }

    // If UserId already exists, just update permissions
    if (model.userId) {
      //  console.log("2nd if block executes")
      const exisitingDeleted = await UserPermission.deleteMany({
        UserId: model.userId,
      });
      // console.log("exisitingDeleted", exisitingDeleted);
      // await UserPermission.bulkWrite(
      //     model.userPermission.map((perm) => ({
      //         updateOne: {
      //             filter: { UserId: model.userId, MenuId: perm.menuId },
      //             update: { $set: {  UserId: model.userId, MenuId: perm.menuId, ParentId: perm.parentId, IsAdd: perm.isAdd, IsEdit: perm.isEdit, IsDel: perm.isDel, IsView: perm.isView, IsPrint: perm.isPrint, IsExport: perm.isExport, IsRelease: perm.IsRelease, IsPost: perm.isPost } }, // Ensuring userId is updated
      //             upsert: true,
      //         },
      //     }))
      // );
      if (model.userPermission?.length > 0) {
        const bulkOps = model?.userPermission?.map((perm) => ({
          insertOne: {
            document: {
              UserId: model.userId || model.UserId,
              MenuId: perm.menuId || model.MenuId,
              ParentId: perm.parentId || model.ParentId,
              IsAdd: perm.isAdd || model.IsAdd,
              IsEdit: perm.isEdit || model.IsEdit,
              IsDel: perm.isDel || model.IsDel,
              IsView: perm.isView || model.IsView,
              IsPrint: perm.isPrint || model.IsPrint,
              IsExport: perm.isExport || model.IsExport,
              isPost: perm.isPost || model.isPost,
              IsRelease: perm.isRelease || model.IsRelease,
            },
          },
        }));

        const updatedPermission = await UserPermission.bulkWrite(bulkOps);
        console.log("updatedPermission", updatedPermission);
      }
      response.status = 1;
      response.message = "Permissions has successfully updated";
    }

    // Update Employee Data

    const empUpdateResult = await EmpMaster.findOneAndUpdate(
      { Empid: model.empid },
      {
        $set: {
          UserId: model.userId || model.registerModel.id,
          RoleId: model.roleId,
          // UserPermission: model.UserPermission,
        },
      },
      { new: true }
    );
    // console.log("empUpdateResult", empUpdateResult)
    // await connectMongoDB();

    // if (!empUpdateResult) throw new Error("Employee not found");

    // await session.commitTransaction();
    // session.endSession();

    response.status = 1;
    response.message = "Update successful";
    response.data = empUpdateResult;
    response.rowCount = empUpdateResult.length;
    return response;
  } catch (error) {
    console.log("error is from query", error);
    throw error;
  }
};

//////////////////////////////////////////////// DeleteEmployeeQuery //////////////////////////////////////////////////////////////////

export const DeleteEmployeeQuery = async (model) => {
  // const session = await mongoose.startSession();
  // session.startTransaction();

  const response = { status: "Failed", message: "" };

  try {
    const { EmpMaster, UserPermission } = await getTenantDBModels();

    // Delete Employee Record
    const empDeleteResult = await EmpMaster.deleteOne({ Empid: model.empid });
    // .session(session);

    if (empDeleteResult.deletedCount === 0) {
      throw new ApiErrorResponse(StatusCodes.NOT_FOUND, "Employee not found");
    }

    // Delete User Permissions in one query
    await UserPermission.deleteMany({ UserId: model.UserId });
    // .session(session);

    // Commit the transaction
    // await session.commitTransaction();
    // session.endSession();

    response.status = "Success";
    response.message = "Successfully Deleted";
    return response;
  } catch (error) {
    // await session.abortTransaction();
    // session.endSession();
    throw error;
  }
};
