import { model } from "mongoose";
import { UserPermission,RolePermission,Menu, RoleMaster } from "../../modals/index.js";
import { StatusCodes } from "http-status-codes";


///////////////////////////////////////////////// loginQuery //////////////////////////////////////////////////

export const loginQuery = async (modal) => {}







//////////////////////////////////////////////  GetUserPermissionQuery  ////////////////////////////////////////////////////////////////

export const GetUserPermissionQuery = async (model) => {
  try {
    const { userId, roleId } = model || {};

    if (!userId || !roleId) {
        throw new Error("Missing required parameters: userId or roleId");
    }

    // Fetch Role Permissions with Menu details
    const rolePermissions = await RolePermission.aggregate([
        {
            $lookup: {
                from: "menus", // Adjusted collection name to follow MongoDB naming conventions
                localField: "MenuId",
                foreignField: "MenuId",
                as: "menuDetails",
            },
        },
        { $unwind: "$menuDetails" },
        {
            $match: {
                RoleId: roleId,
                IsView: 1,
                "menuDetails.IsMenu": 1,
            },
        },
        {
            $project: {
                MenuId: "$menuDetails.MenuId",
                MenuName: "$menuDetails.MenuName",
                ParentId: "$menuDetails.ParentId",
                IsAdd: "$IsAdd",
                IsEdit: "$IsEdit",
                IsDel: "$IsDel",
                IsView: "$IsView",
                IsPrint: "$IsPrint",
                IsExport: "$IsExport",
                IsRelease: "$IsRelease",
                IsPost: "$IsPost",
            },
        },
    ]);

    // Fetch User-Specific Permissions
    const userPermissions = await UserPermission.find({ UserId: userId });

    // Merge Role and User Permissions
    const result = rolePermissions.map((rolePermission) => {
        const userPermission = userPermissions.find(
            (u) => u.MenuId.toString() === rolePermission.MenuId.toString()
        );

        return {
            UserId: userId,
            MenuId: rolePermission.MenuId,
            MenuName: rolePermission.MenuName,
            ParentId: rolePermission.ParentId,
            IsAdd: userPermission?.IsAdd ?? rolePermission.IsAdd ?? 0,
            IsEdit: userPermission?.IsEdit ?? rolePermission.IsEdit ?? 0,
            IsDel: userPermission?.IsDel ?? rolePermission.IsDel ?? 0,
            IsView: userPermission?.IsView ?? rolePermission.IsView ?? 0,
            IsPrint: userPermission?.IsPrint ?? rolePermission.IsPrint ?? 0,
            IsExport: userPermission?.IsExport ?? rolePermission.IsExport ?? 0,
            IsRelease: userPermission?.IsRelease ?? rolePermission.IsRelease ?? 0,
            IsPost: userPermission?.IsPost ?? rolePermission.IsPost ?? 0,
        };
    });

    // Sort the result by MenuName
    result.sort((a, b) => a.MenuName.localeCompare(b.MenuName));

    // Return the successful response
    return {
        isSuccess: "success",
        statusCode: StatusCodes.OK,
        message: "User Permission Details fetched successfully",
        data: result,
        rowCount: result.length,
    };
} catch (error) {
    console.error("Error fetching user permissions:", error.message);
    return {
        isSuccess: "Failed",
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: error.message,
    };
}
  };
  
//////////////////////////////////////////////// addUpdateUserPermissionMasterQuery //////////////////////////////////

export const AddUpdateUserPermissionMasterQuery = async (modal) => {
  try {
    const {userId, userPermission} = modal;
       await UserPermission.deleteMany({ userId });
       const newPermissions = userPermission.map(permission => ({
      userId:permission.userId,
      MenuId: permission.MenuId,
      IsAdd: permission.IsAdd || false,
      IsDel: permission.IsDel || false,
      IsEdit: permission.IsEdit || false,
      IsExport: permission.IsExport || false,
      IsPost: permission.IsPost || false,
      IsPrint: permission.IsPrint || false,
      IsRelease: permission.IsRelease || false,
      IsView: permission.IsView || false,
      ParentId: permission.ParentId || null,
    }));


    if (newPermissions.length === 0) {
      return{
        isSuccess: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: error.message,
      }
    }
    try {
      const result = await UserPermission.insertMany(newPermissions);
      return {
        isSuccess: true,
        statusCode: StatusCodes.OK,
        message: "User Permission Details updated successfully",
        data: result,
      };
    } catch (err) {
    return{
      isSuccess: "Failed",
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: err.message,
    }
    }
  } catch (error) {
    return{
      isSuccess: "Failed",
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message,
    }
  }
};

//////////////////////////////////////////////  GetUserPermissionMaster  ////////////////////////////////////////////////////////////////

export const GetUserPermissionMasterQuery = async(modal)=>{

    try {
      const {UserId} = modal;

      if (UserId === '-1') {
        const  usersPermission = await UserPermission.find().lean();
        return{
          isSuccess:true,
          statusCode: StatusCodes.OK,
          message: 'User Permission Details fetched successfully',
          data: usersPermission,
          rowCount: usersPermission.length
        }
      } else {
        const data =  await UserPermission.aggregate([
          { $match: { UserId } },
          {
            $lookup: {
              from: 'Menu', // MenuMasters collection name
              localField: 'MenuId',
              foreignField: 'MenuId',
              as: 'menuDetails'
            }
          },
          { $unwind: '$menuDetails' }, // Flatten the menuDetails array
          {
            $lookup: {
              from: 'Menu',
              localField: 'ParentId',
              foreignField: 'MenuId',
              as: 'parentMenuDetails'
            }
          },
          { $unwind: '$parentMenuDetails' }, // Flatten the parentMenuDetails array
          {
            $project: {
              UserId: 1,
              MenuId: 1,
              MenuName: '$menuDetails.MenuName',
              ParentId: 1,
              ParentMenuName: '$parentMenuDetails.MenuName',
              IsAdd: 1,
              IsEdit: 1,
              IsDel: 1,
              IsView: 1,
              IsPrint: 1,
              IsExport: 1,
              IsRelease: 1,
              IsPost: 1
            }
          }
        ]);
        return{
          isSuccess:true,
          statusCode: StatusCodes.OK,
          message: 'User Permission Details fetched successfully',
          data:data,
          rowCount: data.length
        }
      }
    
    } 
    catch (error) {
     return{
       isSuccess:false,
       statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
       message: error.message,
     }
    }
  };
  

//////////////////////////////////////////////  GetUserPermissionList  ////////////////////////////////////////////////////////////////

 export const GetUserPermissionListQuery = async(modal)=>{
 
 
  try {
  const {UserId} = modal;

    const userPermissions = await UserPermission.aggregate([
      {
        $group: {
          _id: "$UserId", // Group by UserId
        },
      },
      {
        $lookup: {
          from: "User", // Collection name for users
          localField: "_id", // Field in the UserPermission collection
          foreignField: "USER_ID", // Matching field in the users collection
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails", // Unwind the user details array
      },
      {
        $lookup: {
          from: "rolemasters", // Collection name for role masters
          localField: "userDetails.RANK_ID", // Field in the users collection
          foreignField: "RoleId", // Matching field in the role masters collection
          as: "roleDetails",
        },
      },
      {
        $unwind: "$roleDetails", // Unwind the role details array
      },
      {
        $project: {
          UserId: "$_id",
          UserName: {
            $concat: [
              "$userDetails.FIRST_NAME",
              " ",
              "$userDetails.MIDDLE_NAME",
              " ",
              "$userDetails.SUR_NAME",
            ],
          },
          RoleName: "$roleDetails.RoleName",
        },
      },
    ]);

    return {
      isSuccess: 'success',
      statusCode: 200,
      message: 'User Permission List fetched successfully',
      data: userPermissions,
    }
  } catch (error) {
    return {
      isSuccess: 'failed',
      statusCode: 500,
      message: error.message,
    };
  }

}

//////////////////////////////////////////////  DeleteUserPermissionMaster  ////////////////////////////////////////////////////////////////

export const DeleteUserPermissionMasterQuery = async(modal)=>{
  
try {
  const {UserId} = modal;
    const permissions = await UserPermission.find({ UserId: UserId });

    if (permissions.length > 0) {
        await UserPermission.deleteMany({ UserId: UserId });

        return {
            isSuccess: true,
            statusCode:StatusCodes.OK,
             message: `UserId ${UserId} Successfully deleted`, 
          };
          }
         else {
        return {
           
           isSuccess: false,
            statusCode: StatusCodes.NOT_FOUND,
            message: `UserId ${UserId} does not exist`,
  
        };
    }
} catch (error) {
    return {
      isSuccess: false,
      statusCode: StatusCodes.NOT_FOUND,
      message: error.message,
    };}}
  

//////////////////////////////////////////////  AddUpdateRoleMaster  ////////////////////////////////////////////////////////////////

export const AddUpdateRoleMasterQuery = async(modal)=>{
  try {
    if (!modal.RoleID) {
      // Check if the role already exists
      const roleExists = await RoleMaster.findOne({ RoleName: modal.RoleName });
      if (roleExists) {
       return{
        isSuccess: false,
        statusCode: StatusCodes.CONFLICT,
        message: 'Role already exists!',
       }
      }

      // Create a new role
      await RoleMaster.create({ RoleName: modal.RoleName });
    } else {
      // If RoleId exists, update the role
      const roleExists = await RoleMaster.findOne({ name: modal.RoleName });
      if (roleExists) {
        roleExists.name = modal.RoleName;
        await roleExists.save();
        return {
          isSuccess: true,
          statusCode: StatusCodes.OK,
          message: 'Role updated successfully',
        };
      }
    }

    // Handle RolePermissions
    const roleId = modal.RolePermissions.map((permission) => permission.RoleId)[0];
    if (!roleId) {
     return{
      isSuccess: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Role not found!',
     }
    }

    // Remove existing permissions for the role
    await RolePermission.deleteMany({ RoleId: roleId });

    // Add new permissions
    await RolePermission.insertMany(modal.RolePermissions);

   return{
     isSuccess: true,
     statusCode: StatusCodes.OK,
     message: 'Role updated successfully',
    
   }
  } catch (error) {
   return{
     isSuccess: false,
     statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
     message: error.message,
   }
  }

}

//////////////////////////////////////////////  GetRoleMaster  ////////////////////////////////////////////////////////////////

export const GetRoleMasterQuery = async()=>{
  try {
    const roles = await RoleMaster.find().sort({ name: 1 }); 

    return {
      isSuccess:true,
      statusCode: StatusCodes.OK,
      message: 'Roles fetched successfully',
      data: roles,
      rowCount: roles.length,
    };
  } catch (error) {
    return {
      isSuccess: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message,
    }
  }
}

//////////////////////////////////////////////  Delete / RoleMaster  ////////////////////////////////////////////////////////////////

export const DeleteRoleMasterQuery = async(modal)=>{
  try {
           const {RoleID} = modal
    const roleExists = await RoleMaster.findOne({RoleID:RoleID});

    if (!roleExists) {
        return {
          isSuccess: false,
          statusCode: StatusCodes.NOT_FOUND,
          message: `RoleID  Not Found!`,
        }
    }

    // Delete the role
    await RoleMaster.findOneAndDelete({RoleID:RoleID});

    await RolePermission.deleteMany({RoleID: RoleID });

    return {
      isSuccess: true,
      statusCode: StatusCodes.OK,
      message: `RoleID  deleted successfully`,
    }
} catch (error) {
    return {
      isSuccess: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message,
    }
}
}
  
//////////////////////////////////////////////  AddUpdate / RolePermissionMaster  ////////////////////////////////////////////////////////////////

export const AddUpdateRolePermissionMasterQuery = async(modal)=>{
  try {
    const {
      RoleId,
      MenuId,
      ParentId,
      IsAdd,
      IsEdit,
      IsDel,
      IsView,
      IsPrint,
      IsExport,
      IsRelease,
      IsPost,
    } = modal;

    if (!RoleId || RoleId === "0") {
   return{
     isSuccess: false,
     statusCode: 400,
     message: "Role ID is required",
   }
    }

    let existingRole = await RolePermission.findOne({ RoleId }).lean();

    if (existingRole) {
      // Update existing role
      await RolePermission.updateOne({ RoleId }, {
        MenuId,
        ParentId,
        IsAdd,
        IsEdit,
        IsDel,
        IsView,
        IsPrint,
        IsExport,
        IsRelease,
        IsPost,
      });

      return{
        isSuccess: true,
        statusCode: StatusCodes.OK,
        message: "Successfully Updated",
        data: existingRole,
      }
    } else {
      // Generate new RoleId if necessary
      let tempZoneID = RoleId;
      if (RoleId === "-1" || RoleId === "0") {
        const maxRole = await RolePermission.find().sort({ RoleId: -1 }).limit(1);
        tempZoneID = maxRole.length > 0 ? (parseInt(maxRole[0].RoleId) + 1).toString() : "1";
      }

      // Create a new role
      const newRole = new RolePermission({
        RoleId: tempZoneID,
        MenuId,
        ParentId,
        IsAdd,
        IsEdit,
        IsDel,
        IsView,
        IsPrint,
        IsExport,
        IsRelease,
        IsPost,
      });

      await newRole.save();

      return{
        isSuccess: true,
        statusCode: StatusCodes.OK,
        message: "Successfully Created",
        data: newRole,
      }
    }
  } catch (error) {
    return{
      isSuccess: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message,
    }
  }
}

//////////////////////////////////////////////  Get / RolePermissionMaster  ////////////////////////////////////////////////////////////////

export const GetRolePermissionMasterQuery = async(modal)=>{

try {
  const{RoleId} = modal

    if (RoleId === '-1') {
     const data = await RolePermission.find({}).lean();

      return{
        isSuccess:true,
        statusCode: StatusCodes.OK,
        message: 'Role Permission fetched successfully',
        data: data,
       }
    } else {
     const data = await RolePermission.findOne({RoleId: RoleId }).lean();
      return{
        isSuccess:'success',
        statusCode: StatusCodes.OK,
        message: `RoleID ${data.RoleId} Details of Role Permission fetched successfully`,
        data: data,
       }
    }

 
  } catch (error) {
    return{
      isSuccess: 'failed',
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message,
    }
  }


}

//////////////////////////////////////////////  Get / RolePermission  ////////////////////////////////////////////////////////////////

export const GetRolePermissionQuery = async()=>{

  try {
    const aggregationPipeline = [
      {
        $match: {
          IsMenu: true
        },
      },
      {
        $lookup: {
          from: 'RolePermission', 
          localField: 'MenuId',
          foreignField: 'MenuId',
          as: 'rolepermissions'
        },
      },
      {
        $unwind: {
          path: '$rolepermissions',
          preserveNullAndEmptyArrays: true, // Optional, based on your data
        },
      },
      {
        $project: {
          MenuId: 1,
          MenuName: 1,
          ParentId: 1,
          IsAdd: { $ifNull: [{ $arrayElemAt: ['$role_permissions.IsAdd', 0] }, false] },
          IsEdit: { $ifNull: [{ $arrayElemAt: ['$role_permissions.IsEdit', 0] }, false] },
          IsDel: { $ifNull: [{ $arrayElemAt: ['$role_permissions.IsDel', 0] }, false] },
          IsView: { $ifNull: [{ $arrayElemAt: ['$role_permissions.IsView', 0] }, false] },
          IsPrint: { $ifNull: [{ $arrayElemAt: ['$role_permissions.IsPrint', 0] }, false] },
          IsExport: { $ifNull: [{ $arrayElemAt: ['$role_permissions.IsExport', 0] }, false] },
          IsRelease: { $ifNull: [{ $arrayElemAt: ['$role_permissions.IsRelease', 0] }, false] },
          IsPost: { $ifNull: [{ $arrayElemAt: ['$role_permissions.IsPost', 0] }, false] }
        },
      },
      {
        $sort:{ MenuName: 1 }
      },
      
    ];

    // Execute aggregation query
    const result = await Menu.aggregate(aggregationPipeline);

    if (result.length > 0) {
      return{
        isSuccess:true,
        statusCode: StatusCodes.OK,
        message: 'Role permissions fetched successfully',
        data: result,
      }
    } else {
     return{
      isSuccess: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'No menu permissions found!',
     }
    }
  } catch (error) {
   return{
    isSuccess: false,
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: error.message,
   }
  }
}