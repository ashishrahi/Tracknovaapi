import { StatusCodes } from "http-status-codes";
import { Department } from "../../modals/Department.model.js";

/////////////////////////////////// AddUpdateDepartmentMasterQuery //////////////////////////////////////////////////////////////////////////////////////////////////
export const AddUpdateDepartmentMasterQuery = async (model) => {
 
    
      try {
        if (!model.DepartmentName || model.DepartmentName.trim() === '') {
          
          return{
            isSuccess: false,
            statusCode:StatusCodes.OK,
            message: 'Department Name Is Required'
          }
        }
    
        const existingDepartment = await Department.findOne({ DepartmentId: model.DepartmentId });
    
        if (existingDepartment) {
          if (model.DepartmentName) {
            existingDepartment.DepartmentName = model.DepartmentName.trim();
          }
          if (model.DepartmentShortname) {
            existingDepartment.DepartmentShortname = model.DepartmentShortname.trim();
          }
          if (model.HOD) {
            existingDepartment.HOD = model.HOD;
          }
    
          await existingDepartment.save();
          return{
            isSuccess: true,
            statusCode:StatusCodes.CREATED,
            message: `${existingDepartment.DepartmentName} Successfully Updated`,
            data: existingDepartment
          }
        } else {
          let tempID = model.DepartmentId || 0;
          
          if (tempID === -1 || tempID === 0) {
            const allDepartments = await Department.find();
            tempID = allDepartments.length > 0 ? Math.max(...allDepartments.map(dep => dep.DepartmentId)) + 1 : 1;
          }
    
          model.DepartmentId = tempID;
    
          const departmentExists = await Department.findOne({ DepartmentName: model.DepartmentName });
          if (departmentExists) {
            return{
                isSuccess: false,
                statusCode: StatusCodes.OK,
                message: `Department Name ${departmentExists.DepartmentName} Already Exists`,
                data: departmentExists
  
            }
          }
    
          if (!model.CreatedOn) {
            model.CreatedOn = new Date();
          }
          if (!model.UpdatedOn) {
            model.UpdatedOn = new Date();
          }
    
          // Create and save the new department
          const newDepartment = new Department(model);
          await newDepartment.save();
    
          return{
            isSuccess: "success",
            statusCode: StatusCodes.CREATED,
            message: `${newDepartment.DepartmentName} Department Successfully Added`,
            data: newDepartment
          }
        }
      } catch (err) {
        response.Mesg = err.message;
        if (err.code === 11000) { // Duplicate key error
          return{
            isSuccess: 'failed',
            statusCode: StatusCodes.OK,
            message: `${model.DepartmentName} Already Exists`
          }
        }
      }
    
      return response;
};

/////////////////////////////////// GetDepartmentMasterQuery //////////////////////////////////////////////////////////////////
export const GetDepartmentMasterQuery = async (model) => {
  try {
    const queryConditions = {};

    // Add conditions to the query object
    if (model.DepartmentId !== -1) {
      queryConditions.DepartmentId = model.DepartmentId;
    }

    if (model.DepartmentName !== "-1" && model.DepartmentName !== "") {
      queryConditions.DepartmentName = model.DepartmentName;
    }

    // Execute the query with conditions
    const result = await Department.findOne(queryConditions)
      .select(
        "DepartmentId DepartmentName DepartmentShortname CreatedBy UpdatedBy CreatedOn UpdatedOn HOD"
      )
      .exec();

    return {
      isSuccess: "success",
      statusCode: StatusCodes.OK,
      message: `Department Details of ${result.DepartmentName} department has been fetched successfully`,
      data: result,
    };
  } catch (ex) {
    return {
      isSuccess: "failed",
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: ex.message,
    };
  }

  return {
    isSuccess: "failed",
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: "An unexpected error occurred",
  };
};

/////////////////////////////////// DeleteDepartmentMasterQuery //////////////////////////////////////////////////////////////////

export const DeleteDepartmentMasterQuery = async (model) => {
    try {
        const department = await Department.find({ DepartmentId: model.DepartmentId }).exec();

        if (department && department.length > 0) {
            await Department.deleteMany({ DepartmentId: model.DepartmentId });

            return {
                isSuccess: 'success',
                statusCode:StatusCodes.OK,
                message: `DepartmentId ${model.DepartmentId} Successfully deleted`
            };
        } else {
            return {
                isSuccess: "failed",
                statusCode: StatusCodes.NOT_FOUND,
                message: `DepartmentId ${model.DepartmentId} not found`
            };
        }
    } catch (err) {
        return {
            isSuccess: false,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: err.message + ";" + (err.innerException ? err.innerException : err.message)
        };
    }
};
