import { EmpMaster,  UserPermission } from '../../modals/index.js'
import { StatusCodes } from 'http-status-codes';
import ApiErrorResponse from '../apiResponse/ApiErrorResponse.js';

//---------AddUpdateEmployeeQuery------> 
export const AddUpdateEmployeeQuery = async (model, next) => {
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
      if(value === "Dlno"){
        validFormedData["DLNO"]  = model[value.charAt(0).toLowerCase() + value.slice(1)];
      } //else if(value === "Dlno"){} 
      else {
        validFormedData[value]  = model[value.charAt(0).toLowerCase() + value.slice(1)];
      }
    } 

    if (!model.empid || model.empid === 0) {
      if (existingEmployee) {
        throw new ApiErrorResponse(StatusCodes.BAD_REQUEST, "Record Already Exists!");
      }

      const lastEmployee = await EmpMaster.findOne().sort({ Empid: -1 })
      // .session(session);
   
      validFormedData.Empid = (lastEmployee?.Empid || 0) + 1;
      validFormedData.UserId = crypto.randomUUID();

      // Insert New Employee
      const newUser = await new EmpMaster(validFormedData).save();
      if(!newUser){
        const error = new Error("Failed to create new employee");
        error.status = StatusCodes.INTERNAL_SERVER_ERROR;
        return next(error);
      }

      response.data = newUser;
      response.message = "Employee Successfully Added";

    } else {
      // Update Existing Employee
      const updatedEmp = await EmpMaster.updateOne({ Empid: model.empid }, { $set: validFormedData});
        if(!updatedEmp.acknowledged){
          throw new ApiErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to update the Employee")
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
          Empid: 1,
          EmpName: {
            $ifNull: ["$EmpName", ""]
          },
          EmpCode: 1,
          EmpPerAddress: 1,
          EmpLocalAddress: 1,
          EmpFatherName: 1,
          EmpspauseName: 1,
          EmpMotherName: 1,
          EmpMobileNo: 1,
          EmpStatus: 1,
          EmpPanNumber: 1,
          EmpAddharNo: 1,
          EmpDob: 1,
          EmpJoiningDate: 1,
          EmpretirementDate: 1,
          EmpDesignationId: 1,
          EmpDeptId: 1,
          EmpStateId: 1,
          EmpCountryID: 1,
          EmpCityId: 1,
          EmpPincode: 1,
          CreatedBy: 1,
          UpdatedBy: 1,
          CreatedOn: 1,
          UpdatedOn: 1,
          UserId: 1,
          RoleId: 1,
          ImageFile: 1,
          SignatureFile: 1,
          Email: 1,
          DLNO: 1,
          Gender: 1,
          DepartmentName:
            "$Department.DepartmentName",
          DesignationName:
            "$Designation.DesignationName",
          EmpStateName: "$State.StateName",
          EmpCountryName: "$Country.CountryName",
          EmpCityName: "$City.CityName",
          Srno: 1,
          EmpDepName:  "$Department.DepartmentName",
        }
      }
    ]);
    const response = {
      data: employees,
      status: true,
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

export const UpsertEmpPermissionQuery = async (model) => {

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
