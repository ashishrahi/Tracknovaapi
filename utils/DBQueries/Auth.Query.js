import { model } from "mongoose";
import { UserPermission,RolePermission,Menu, AspNetRoles } from "../../modals/index.js";
import { StatusCodes } from "http-status-codes";


///////////////////////////////////////////////// loginQuery //////////////////////////////////////////////////

export const loginQuery = async (modal) => {

}

//////////////////////////////////////////////  GetUserPermissionQuery  ////////////////////////////////////////////////////////////////

export const GetUserPermissionQuery = async (model) => {
  try {
    const { UserId, RoleId } = model || {};

    if (!UserId || !RoleId) {
        throw new Error("Missing required parameters: userId or roleId");
    }

    // Fetch Role Permissions with Menu details
    const rolePermissions = await RolePermission.aggregate([
        {
            $lookup: {
                from: "Menu",
                localField: "MenuId",
                foreignField: "MenuId",
                as: "menuDetails",
            },
        },
        { $unwind: "$menuDetails" },
        {
            $match: {
                RoleId: RoleId,
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
    const userPermissions = await UserPermission.find({ UserId: UserId });

    // Merge Role and User Permissions
    const result = rolePermissions.map((rolePermission) => {
        const userPermission = userPermissions.find(
            (u) => u.MenuId.toString() === rolePermission.MenuId.toString()
        );

        return {
            UserId: UserId,
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
        isSuccess: true,
        statusCode: StatusCodes.OK,
        message: "User Permission Details fetched successfully",
        data: result,
        rowCount: result.length,
    };
} catch (error) {
    return {
        isSuccess: false,
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
      isSuccess: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: err.message,
    }
    }
  } catch (error) {
    
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
          from: "RoleMaster", // Collection name for role masters
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

  
  const upsertRole = async (req, res) => {
    try {
      const { roleId, roleName, rolePermissions } = req.body;
  
      if (!roleId) {
        // Check if role already exists
        const roleExists = await Role.findOne({ name: roleName });
        if (roleExists) {
          return res.status(400).json({ status: "Failed", message: "Role already exists!" });
        }
  
        // Create new role
        await Role.create({ name: roleName });
      } else {
        // Update existing role
        const roleExists = await Role.findOne({ _id: roleId });
        if (!roleExists) {
          return res.status(404).json({ status: "Failed", message: "Role not found!" });
        }
  
        await Role.updateOne({ _id: roleId }, { name: roleName });
      }
  
      // Handle role permissions
      const rolePermissionId = rolePermissions.length ? rolePermissions[0].roleId : null;
  
      if (rolePermissionId) {
        await RolePermission.deleteMany({ roleId: rolePermissionId });
        await RolePermission.insertMany(rolePermissions);
      }
  
      return res.status(200).json({ status: "Success", message: "Record Saved!!" });
    } catch (error) {
      return res.status(500).json({ status: "Failed", message: error.message });
    }
  };
  
  
}

//////////////////////////////////////////////  GetRoleMaster  ////////////////////////////////////////////////////////////////

export const GetRoleMasterQuery = async()=>{
  try {

    const roles = await AspNetRoles.find().sort({ Name: 1 }); 

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
           const roleExists = await AspNetRoles.findOne({RoleID:RoleID});
            
    if (!roleExists) {
        return {
          isSuccess: false,
          statusCode: StatusCodes.NOT_FOUND,
          message: `RoleID  Not Found!`,
        }
    }

    // Delete the role
    await AspNetRoles.findOneAndDelete({RoleID:RoleID});

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
    if (!modal.RoleId || modal.RoleId === "0") {
        return {
            isSuccess: false,
            statusCode: StatusCodes.BAD_REQUEST,
            message: "Role ID is required",
        };
    }

    const updatedRole = await RolePermission.findOneAndUpdate(
        { RoleId: modal.RoleId },
        { $set: modal},
        { new: true, upsert: true, lean: true }
    );
       console.log('updatedRole:',updatedRole);
    if (updatedRole) {
        return {
            isSuccess: true,
            statusCode: StatusCodes.OK,
            message: "Role Permission updated successfully",
            data: updatedRole,
        };
    }

    let tempZoneID = 1;

    if (modal.RoleId === "-1" || modal.RoleId === "0") {
        const maxRole = await RolePermission.findOne({}, { RoleId: 1 }).sort({ RoleId: -1 });

        if (maxRole && maxRole.RoleId) {
            tempZoneID = parseInt(maxRole.RoleId, 10) + 1;
        }
    }

    modal.RoleId = tempZoneID.toString();

    const newRolePermission = await RolePermission.create(modal);
console.log('newRolePermission:',newRolePermission);


    return {
        isSuccess: true,
        statusCode: StatusCodes.OK,
        message: "Role Permission added successfully",
        data: newRolePermission,
    };
} catch (error) {
    return {
        isSuccess: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: error.message,
    };
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
      isSuccess: false,
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