import {CountryMaster,EmpMaster,Designation,Department,StateMaster,UserPermission} from '../../modals/index.js'
import { StatusCodes } from 'http-status-codes';
//////////////////////////////////////////////// AddUpdateEmployeeQuery //////////////////////////////////////////////////////////////////

export const AddUpdateEmployeeQuery = async (model) => {

}

///////////////////////////////////////////////  GetEmployeeQuery      //////////////////////////////////////////////////////////////////

export const GetEmployeeQuery = async (model) => {
    try {
    const { where = {}, pageNo = 1, pageSize = 10 } = model;

    const pipeline = [
      { $match: where }, // Apply filter early for performance
      {
        $lookup: {
          from: 'Department',
          localField: 'EmpDeptId',
          foreignField: 'DepartmentId',
          as: 'department',
        },
      },
      { $unwind: { path: '$department', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'Designation',
          localField: 'EmpDesignationId',
          foreignField: 'DesignationId',
          as: 'designation',
        },
      },
      { $unwind: { path: '$designation', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'StateMaster',
          localField: 'EmpStateId',
          foreignField: 'StateId',
          as: 'state',
        },
      },
      { $unwind: { path: '$state', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'CountryMaster',
          localField: 'EmpCountryID',
          foreignField: 'CountryId',
          as: 'country',
        },
      },
      { $unwind: { path: '$country', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          Empid: 1,
          EmpName: { $ifNull: ['$EmpName', ''] },
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
          DepartmentName: '$department.DepartmentName',
          DesignationName: '$designation.DesignationName',
          EmpStateName: '$state.StateName',
          EmpCountryName: '$country.CountryName',
          EmpCityName: 1,
          Srno: 1,
          EmpDepName: 1,
        },
      },
      { $skip: (pageNo - 1) * pageSize },
      { $limit: pageSize },
    ];

    const data = await EmpMaster.aggregate(pipeline);
    const rowCount = await EmpMaster.countDocuments(where);

    return {
      isSuccess:true,
      statusCode:StatusCodes.OK,
      message: 'Employee data fetched successfully',
      data,
      pageNo,
      pageSize,
      rowCount,
    };
  } catch (error) {
     return{
      isSuccess:false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message,
    }
  }}


/////////////////////////////////////////////// UpsertEmpPermissionQuery //////////////////////////////////////////////////////////////////

export const UpsertEmpPermissionQuery = async (model) => {

}


//////////////////////////////////////////////// DeleteEmployeeQuery //////////////////////////////////////////////////////////////////

export const DeleteEmployeeQuery = async (model) => {
    
    let response = {
        status: 'failed',
        message: ''
      };
    
      try {
        // Find the employee by Empid
        const employee = await EmpMaster.findOne(model.Empid);
    
        if (!employee) {
          response.message = 'Employee not found';
          return response;
        }
    
        // Remove the employee
        await EmpMaster.findOneAndDelete(model.Empid);
    
        // Find and remove the associated user permissions
        await UserPermission.deleteMany({ UserId: model.UserId });
    
        response.status = 'success';
        response.message = 'Successfully Deleted';
      } catch (error) {
        response.message = error.message || 'An error occurred';
      }
    
      return response;
}
