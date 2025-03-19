import { AspNetUsers, EmpMaster,  UserPermission } from '../../modals/index.js'
import { StatusCodes } from 'http-status-codes';
import { ApiErrorResponse } from '../apiResponse/index.js';
import { AuthController } from '../../controllers/index.js';
import { AddUpdateUserPermissionMasterQuery, RegisterQuery } from "../DBQueries/Auth.Query.js"

//---------AddUpdateEmployeeQuery------> 
export const AddUpdateEmployeeQuery = async (model) => {
  try {
    let response = {};
  
    // Check if Employee Exists
    const existingEmployee = await EmpMaster.findOne(
      { EmpName: model.empName, EmpMobileNo: model.empMobileNo }
      // null,
      // { session }
    );

    // Preparing correct format;
    const correctKeys = Object.keys(model).map(key => key.charAt(0).toUpperCase() + key.slice(1))
    const validFormedData = {};
      
    for(const value of correctKeys){
      console.log("Value for employee", value)
      // console.log("model", model)
      if(value === "Dlno"){
        validFormedData["DLNo"]  = value &&  model[value?.charAt(0).toLowerCase() + value?.slice(1)];
      }
      else {
        validFormedData[value]  = value &&  model[value?.charAt(0).toLowerCase() + value?.slice(1)];
      }
    } 

    if (!model.empid || model.empid === 0) {
      if (existingEmployee) {
        throw new ApiErrorResponse(StatusCodes.BAD_REQUEST, "Record Already Exists!");
      }

      const lastEmployee = await EmpMaster.findOne().sort({ Empid: -1 })
      // .session(session);
   
      validFormedData.Empid = (lastEmployee?.Empid || 0) + 1;
      // validFormedData.UserId = crypto.randomUUID();

      // Insert New Employee
      const newUser = await new EmpMaster(validFormedData).save();
      if(!newUser){
        
        // const error = new Error("Failed to create new employee");
        // error.status = StatusCodes.INTERNAL_SERVER_ERROR;
        // return next(error);
        throw new ApiErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to create employee")
      }

      response.data = newUser;
      response.message = "Employee Successfully Added";

    } else {
      // Update Existing Employee
      // console.log("validFormedData", validFormedData)
      const updatedEmp = await EmpMaster.updateOne({ Empid: model.empid }, { $set: validFormedData});
      console.log("updatedEmp", updatedEmp)

        if(!updatedEmp.acknowledged ){
          throw new ApiErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to update the Employee")
        }
        if(updatedEmp.modifiedCount < 0){
          throw new ApiErrorResponse(StatusCodes.BAD_REQUEST, "Employee not found")
        }
      response.message = "Employee Successfully Updated";
    }

    return response;
  } catch (error) {
    throw error;
  }
}

//---------GetEmployeeQuery------>  

export const GetEmployeeQuery = async (model) => {
  try {
    let { pageNo = 1, pageSize = 10 } = model
    const skip = (pageNo = 1 - 1) * pageSize; // Calculate skip dynamically
    const employees = await EmpMaster.aggregate([
      {
        $lookup: {
          from: "Department",
          localField: "EmpDeptId",
          foreignField: "DepartmentId",
          as: "Department"
        }
      },
      {
        $unwind: {
          path: "$Department",
          preserveNullAndEmptyArrays: true
        }
      },
      // Lookup Designation
      {
        $lookup: {
          from: "Designation",
          localField: "EmpDesignationId",
          foreignField: "DesignationId",
          as: "Designation"
        }
      },
      {
        $unwind: {
          path: "$Designation",
          preserveNullAndEmptyArrays: true
        }
      },
      // Lookup State
      {
        $lookup: {
          from: "StateMaster",
          localField: "EmpStateId",
          foreignField: "StateId",
          as: "State"
        }
      },
      {
        $unwind: {
          path: "$State",
          preserveNullAndEmptyArrays: true
        }
      },
      // Lookup Country
      {
        $lookup: {
          from: "CountryMaster",
          localField: "EmpCountryID",
          foreignField: "CountryId",
          as: "Country"
        }
      },
      {
        $unwind: {
          path: "$Country",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "CityMaster",
          localField: "EmpCityId",
          foreignField: "CityId",
          as: "City"
        }
      },
      {
        $unwind: {
          path: "$City",
          preserveNullAndEmptyArrays: true
        }
      },
      // Project required fields
      {
        $project: {
          empid: "$Empid",
          empName: {
            $ifNull: ["$EmpName", ""]
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
          departmentName:
            "$Department.DepartmentName",
          designationName:
            "$Designation.DesignationName",
          empStateName: "$State.StateName",
          empCountryName: "$Country.CountryName",
          empCityName: "$City.CityName",
          srno: "$Srno",
          empDepName:  "$Department.DepartmentName",
        }
      }
    ]);
    const response = {
      status: 1,
      message:"Employees data fetched successfully",
      data: employees,
      pageNo: pageNo,
      pageSize: pageSize,
      rowCount: employees.length
    };
    return  response;
  } catch (error) {
    throw new ApiErrorResponse(StatusCodes.BAD_REQUEST, error.message);
  }
}


/////////////////////////////////////////////// UpsertEmpPermissionQuery //////////////////////////////////////////////////////////////////

export const UpsertEmpPermissionQuery = async (model, res) => {
  let response = { status: "Failed", message: "" };
    // console.log("model",model)
  try {
      // If UserId is empty or null, register the user first
      model.registerModel.id = crypto.randomUUID();

      // if userId is not given register first user
      if (!model.userId) {
          console.log(" first if block executed")
          const  { registerModel , userId, roleId} = model
          console.table({registerModel , userId, roleId})
          
          if(model.registerModel?.username?.trim() === "" ){
            throw new ApiErrorResponse(StatusCodes.BAD_REQUEST, "Please provide valid username")
          }
          if(model.registerModel?.password === ""){
            throw new ApiErrorResponse(StatusCodes.BAD_REQUEST, "Please provide valid password")
          }
        // it register user in AspNetUsers Table
        // if(model.registerModel?.username.trim() === ""){
        //   throw new ApiErrorResponse(StatusCodes.BAD_REQUEST, "Please provide valid Username or UserId")
        // }
        // model.registerModel.id  =====> Crypto UUID
        const newAspUser = await RegisterQuery(model.registerModel, res);

        if (!newAspUser) return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new ApiErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to create a request. Try Again!!")) ;
        
        model.userPermission.forEach((perm) => (perm.userId = model.registerModel.id));
        
        // Upsert User Permissions
        const upsertResponse = await AddUpdateUserPermissionMasterQuery(model.registerModel.id, model.userPermission);
        if (upsertResponse.isSuccess === false) throw new ApiErrorResponse(StatusCodes.BAD_REQUEST,upsertResponse.message);
      }

      // If UserId already exists, just update permissions
      if (model.userId) {
      //  console.log("2nd if block executes")
        const exisitingDeleted = await UserPermission.deleteMany({ UserId: model.userId});
        console.log("exisitingDeleted", exisitingDeleted)
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
                      UserId: model.userId,
                      MenuId: perm.menuId,
                      ParentId: perm.parentId,
                      IsAdd: perm.isAdd,
                      IsEdit: perm.isEdit,
                      IsDel: perm.isDel,
                      IsView: perm.isView,
                      IsPrint: perm.isPrint,
                      IsExport: perm.isExport,
                      isPost: perm.isPost,
                      IsRelease: perm.isRelease,
                    },
                  },
                }));
        
                const updatedPermission = await UserPermission.bulkWrite(bulkOps);
                console.log("updatedPermission",updatedPermission)
              }
        response.status = StatusCodes.CREATED
        response.message = "Permissions has successfully updated";

        return response
      }
      console.log("Without if block ")
      // Update Employee Data
      
      const empUpdateResult = await EmpMaster.findOneAndUpdate(
          { Empid : model.empid },
          {
              $set: {
                  UserId: model.registerModel.id,
                  RoleId: model.roleId,
                  // UserPermission: model.UserPermission,
              },
          },
          { new: true }
      );


      // if (!empUpdateResult) throw new Error("Employee not found");

      // await session.commitTransaction();
      // session.endSession();

      response.status = 1;
      response.message = "Update successful";
      response.data = empUpdateResult;
      response.rowCount = empUpdateResult.length;
      return response;

  } catch (error) {
    console.log("error is from query",error);
      throw error;
  }

  
}


//////////////////////////////////////////////// DeleteEmployeeQuery //////////////////////////////////////////////////////////////////

export const DeleteEmployeeQuery = async (model) => {
    
  // const session = await mongoose.startSession();
  // session.startTransaction();
  
  const response = { status: "Failed", message: "" };

  try {
      // Delete Employee Record
      const empDeleteResult = await EmpMaster.deleteOne({ Empid : model.empid })
      // .session(session);

      if (empDeleteResult.deletedCount === 0) {
          throw new ApiErrorResponse(StatusCodes.NOT_FOUND, "Employee not found");
      }

      // Delete User Permissions in one query
      await UserPermission.deleteMany({ UserId: model.UserId })
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
}
