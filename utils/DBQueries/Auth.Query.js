import { UserPermission,RolePermission,Menu, RoleMaster } from "../../modals/index.js";

//////////////////////////////////////////////  GetUserPermissionQuery  ////////////////////////////////////////////////////////////////

export const GetUserPermissionQuery = async (userId,roleId) => {
  try {
    // Fetch Role Permissions and Menu details
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
                "RoleId": roleId,
                "IsView": 1,
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

    // Fetch User Permissions and combine them
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
            IsAdd: userPermission?.IsAdd || rolePermission.IsAdd || 0,
            IsEdit: userPermission?.IsEdit || rolePermission.IsEdit || 0,
            IsDel: userPermission?.IsDel || rolePermission.IsDel || 0,
            IsView: userPermission?.IsView || rolePermission.IsView || 0,
            IsPrint: userPermission?.IsPrint || rolePermission.IsPrint || 0,
            IsExport: userPermission?.IsExport || rolePermission.IsExport || 0,
            IsRelease: userPermission?.IsRelease || rolePermission.IsRelease || 0,
            IsPost: userPermission?.IsPost || rolePermission.IsPost || 0,
        };
    });

    // Sort by MenuName
    result.sort((a, b) => a.MenuName.localeCompare(b.MenuName));

    return {
        data: result,
        status: "Success",
        rowCount: result.length,
    };
} catch (error) {
    return {
        status: "Failed",
        error,
    };
}
  };
  
//////////////////////////////////////////////// addUpdateUserPermissionMasterQuery //////////////////////////////////

export const AddUpdateUserPermissionMasterQuery = async (userId, userPermission) => {
  try {
       await UserPermission.deleteMany({ userId });
       const newPermissions = userPermission.map(permission => ({
      userId,
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

    console.log("Prepared Permissions:", newPermissions);

    if (newPermissions.length === 0) {
      throw new Error("No valid permissions to insert.");
    }
    try {
      const result = await UserPermission.insertMany(newPermissions);
      console.log("Insert Result:", result);
      return result;
    } catch (err) {
      console.error("Error during insertMany:", err.message);
      throw err;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

//////////////////////////////////////////////  GetUserPermissionMaster  ////////////////////////////////////////////////////////////////

export const GetUserPermissionMasterQuery = async(UserId)=>{
  if (UserId === '-1') 
    {
    return await UserPermission.find().lean();
    } 
  else {
    return await UserPermission.aggregate([
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
  }}

//////////////////////////////////////////////  GetUserPermissionList  ////////////////////////////////////////////////////////////////

 export const GetUserPermissionListQuery = async(UserId)=>{
  try {
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
      isSuccess: true,
      data: userPermissions,
      mesg: "",
    };
  } catch (error) {
    return {
      isSuccess: false,
      mesg: error.message,
    };
  }

}

//////////////////////////////////////////////  DeleteUserPermissionMaster  ////////////////////////////////////////////////////////////////

export const DeleteUserPermissionMasterQuery = async(userId)=>{
  if (!userId) {
    return {
        isSuccess: false,
        message: 'UserId is required',
    };}
try {
    const permissions = await UserPermission.find({ UserId: userId });

    if (permissions.length > 0) {
        await UserPermission.deleteMany({ UserId: userId });

        return {
            isSuccess: true,
            message: 'Successfully deleted', };}
         else {
        return {
            isSuccess: false,
            message: 'User Permission Id Not Found!',
        };
    }
} catch (error) {
    return {
        isSuccess: false,
        message: error.message || 'An unexpected error occurred',
    };}}


//////////////////////////////////////////////  AddUpdateRoleMaster  ////////////////////////////////////////////////////////////////

export const AddUpdateRoleMasterQuery = async()=>{

}

//////////////////////////////////////////////  GetRoleMaster  ////////////////////////////////////////////////////////////////

export const GetRoleMasterQuery = async()=>{

}

//////////////////////////////////////////////  Delete / RoleMaster  ////////////////////////////////////////////////////////////////

export const DeleteRoleMasterQuery = async(roleId)=>{
  try {
    // Check if the role exists
    const roleExists = await RoleMaster.findById({ roleId: roleId });
    if (!roleExists) {
        return {
            status: "Failed",
            message: "Role not found",
        };
    }

    // Delete the role
    await RoleMaster.deleteOne({ _id: roleId });

    // Remove associated permissions
    await RolePermission.deleteMany({ roleId });

    return {
        status: "Success",
        message: "Record Deleted!!",
    };
} catch (error) {
    return {
        status: "Failed",
        message: error.message,
    };
}
}
  
//////////////////////////////////////////////  AddUpdate / RolePermissionMaster  ////////////////////////////////////////////////////////////////

export const AddUpdateRolePermissionMasterQuery = async(modal)=>{
  const result = {
    IsSuccess: false,
    Mesg: '',
};
 const{RoleId} = modal
try {
    if (!RoleId || RoleId === "0") {
        result.IsSuccess = false;
        result.Mesg = "Role ID Is Required";
        return result;
    }
        
    // If RoleId already exists

    const existingRole = await RolePermission.findOne({ RoleId: RoleId })
    console.log(existingRole)
       if (existingRole) {
        // Update the existing RolePermission
        existingRole.RoleId = RoleId;
        await existingRole.save();
      result.IsSuccess = true;
        result.Mesg = "Successfully Updated";
    }
   
    // If New RoleId exists
    else {
        let tempZoneID = 0;
       console.log( RoleId)

        

        if (RoleId === "-1" || !RoleId || RoleId === "0") {
            const rolePermissions = await RolePermission.find().select('RoleId')

            if (rolePermissions.length > 0) {
                const maxRoleId = Math.max(...rolePermissions.map(rp => parseInt(rp.RoleId, 10)));
                tempZoneID = maxRoleId + 1;
            } else {
                tempZoneID = 1;
            }
        }

            RoleId = tempZoneID.toString();
        const newRolePermission = new RolePermission(modal);
        await newRolePermission.save();

        result.IsSuccess = true;
        result.Mesg = "Successfully Added";
    }

    return result;
} catch (error) {
    result.IsSuccess = false;
    result.Mesg = `Error: ${error.message}; ${error.innerException ? error.innerException.message : ''}`;
    return result;
}
}

//////////////////////////////////////////////  Get / RolePermissionMaster  ////////////////////////////////////////////////////////////////

export const GetRolePermissionMasterQuery = async(roleId)=>{
  const response = {
    isSuccess: false,
    data: null,
    message: '',
  };

  try {
    let data;

    if (roleId === '-1') {
      data = await RolePermission.find({}).lean();
    } else {
      data = await RolePermission.findOne({RoleId: roleId }).lean();
    }

    response.isSuccess = true;
    response.data = data;
  } catch (error) {
    response.message = `${error.message};${error.cause || ''}`;
  }

  return response;

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
          from: 'rolepermissions', 
          localField: 'MenuId',
          foreignField: 'MenuId',
          as: 'role_permissions'
        },
      },
      {
        $unwind: {
          path: '$role_permissions',
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
      return { ParentMenu: result };
    } else {
      return { message: 'No user permissions found' };
    }
  } catch (error) {
    console.error(error);
    throw new Error('Server Error');
  }
}