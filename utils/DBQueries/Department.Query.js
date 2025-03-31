import { StatusCodes } from "http-status-codes";
import { Department } from "../../modals/index.js";
import { getTenantDBModels } from "../../db/index.js";

/////////////////////////////////// AddUpdateDepartmentMasterQuery //////////////////////////////////////////////////////////////////////////////////////////////////
export const AddUpdateDepartmentMasterQuery = async (model) => {
  try {
    const { Department } = await getTenantDBModels();

    if (!model.departmentName || model.departmentName.trim() === "") {
      return {
        isSuccess: 0,
        internalSuccess: "",
        insertedId: "",
        mesg: "Department Name Is Required",
      };
    }

    const existingDepartment = await Department.findOne({
      DepartmentId: model.departmentId,
    });

    if (existingDepartment) {
      if (model.departmentName) {
        existingDepartment.DepartmentName = model.departmentName.trim();
      }
      if (model.DepartmentShortname) {
        existingDepartment.DepartmentShortname =
          model.departmentShortname.trim();
      }
      if (model.HOD) {
        existingDepartment.HOD = model.hod;
      }

      await existingDepartment.save();

      const newData = {
        departmentId: existingDepartment.DepartmentId,
        departmentName: existingDepartment.DepartmentName,
        departmentShortname: existingDepartment.DepartmentShortname,
        hod: existingDepartment.HOD,
        createdBy: existingDepartment.CreatedBy,
        updatedBy: existingDepartment.UpdatedBy,
      };

      return {
        isSuccess: 1,
        internalSuccess: "",
        insertedId: "",
        mesg: `${existingDepartment.DepartmentName} Successfully Updated`,
        data: newData,
      };
    } else {
      let tempID = model.departmentId || 0;

      if (tempID === -1 || tempID === 0) {
        const allDepartments = await Department.find();
        tempID =
          allDepartments.length > 0
            ? Math.max(...allDepartments.map((dep) => dep.DepartmentId)) + 1
            : 1;
      }

      model.departmentId = tempID;

      const departmentExists = await Department.findOne({
        DepartmentName: model.departmentName,
      });
      if (departmentExists) {
        return {
          isSuccess: 0,
          internalSuccess: "",
          mesg: `Department Name ${departmentExists.DepartmentName} Already Exists`,
          data: departmentExists,
        };
      }

      if (!model.CreatedOn) {
        model.CreatedOn = new Date();
      }
      if (!model.UpdatedOn) {
        model.UpdatedOn = new Date();
      }

      // Create and save the new department
      const newDepartment = new Department({
        DepartmentId: model.departmentId,
        DepartmentName: model.departmentName,
        DepartmentShortname: model.departmentShortname,
        HOD: model.hod,
        CreatedBy: model.createdBy,
        UpdatedBy: model.updatedBy,
      });
      await newDepartment.save();

      const newData = {
        departmentId: newDepartment.DepartmentId,
        departmentName: newDepartment.DepartmentName,
        departmentShortname: newDepartment.DepartmentShortname,
        hod: newDepartment.HOD,
        createdBy: newDepartment.CreatedBy,
        updatedBy: newDepartment.UpdatedBy,
      };

      return {
        isSuccess: 1,
        internalSuccess: "",
        insertedId: "",
        mesg: `${newDepartment.DepartmentName} Department Successfully Added`,
        data: newData,
      };
    }
  } catch (err) {
    return {
      isSuccess: 0,
      message: `${model.DepartmentName} Already Exists`,
    };
  }
};

/////////////////////////////////// GetDepartmentMasterQuery //////////////////////////////////////////////////////////////////
export const GetDepartmentMasterQuery = async (model) => {
  try {
    const { Department } = await getTenantDBModels();

    const queryConditions = {};

    // Add conditions to the query object
    if (model.departmentId !== -1) {
      queryConditions.DepartmentId = model.departmentId;
    }

    if (model.departmentName !== "-1" && model.departmentName !== "") {
      queryConditions.DepartmentName = model.departmentName;
    }

    // Execute the query with conditions
    const result = await Department.find(queryConditions)
      .select(
        "DepartmentId DepartmentName DepartmentShortname CreatedBy UpdatedBy CreatedOn UpdatedOn HOD"
      )
      .exec();
    const newData = result.map((dept) => {
      return {
        departmentId: dept.DepartmentId,
        departmentName: dept.DepartmentName,
        departmentShortname: dept.DepartmentShortname,
        hod: dept.HOD,
        createdBy: dept.CreatedBy,
        updatedBy: dept.UpdatedBy,
      };
    });

    return {
      isSuccess: 1,
      internalSuccess: "",
      mesg: `Department Details of ${result.DepartmentName} department has been fetched successfully`,
      insertedId: "",
      data: newData,
    };
  } catch (ex) {
    return {
      isSuccess: 0,
      internalSuccess: "",
      mesg: ex.message,
    };
  }
};

/////////////////////////////////// DeleteDepartmentMasterQuery //////////////////////////////////////////////////////////////////

export const DeleteDepartmentMasterQuery = async (model) => {
  try {
    const { Department } = await getTenantDBModels();

    const department = await Department.find({
      DepartmentId: model.departmentId,
    }).exec();

    if (department && department.length > 0) {
      await Department.deleteMany({ DepartmentId: model.departmentId });

      return {
        isSuccess: 1,
        internalSuccess: "",
        mesg: `DepartmentId ${model.departmentId} Successfully deleted`,
        insertedId: "",
      };
    } else {
      return {
        isSuccess: 0,
        internalSuccess: "",
        mesg: `DepartmentId ${model.departmentId} not found`,
        insertedId: "",
      };
    }
  } catch (err) {
    return {
      isSuccess: 0,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      mesg:
        err.message +
        ";" +
        (err.innerException ? err.innerException : err.message),
    };
  }
};
