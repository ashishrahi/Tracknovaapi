import {
  UserPermission,
  RolePermission,
  Menu,
  AspNetRoles,
  EmpMaster
} from "../../modals/index.js";
import { StatusCodes } from "http-status-codes";
import { ApiErrorResponse } from "../apiResponse/index.js";
import mongoose from "mongoose";
import cryto from 'crypto'



//-----------------loginQuery-------->
export const loginQuery = async (model) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await AspNetUsers.findOne({ UserName: username });
    if (!user) {
        return next(new ApiErrorResponse(StatusCodes.UNAUTHORIZED, "Invalid Username or Password"));
    }

    // Check password
    const isPasswordValid = await user.isValidPassword(password);
    if (!isPasswordValid) {
      return next(new ApiErrorResponse(StatusCodes.UNAUTHORIZED, "Invalid Username or Password"));
    }

    // Fetch user roles
    const roles = await Role.find({ _id: { $in: user.roles } });
    const rolesString = roles.map(role => role.name).join(",");

    // Fetch user permissions
    const userPermissions = await getUserPermissions(user._id, rolesString);
    if (!userPermissions.success) {
        return res.status(500).json({ status: "Failed", message: "Failed to fetch user permissions" });
    }

    // Generate JWT Token
    const authClaims = {
        id: user._id,
        username: user.username,
        roles: rolesString,
    };

    const token = jwt.sign(authClaims, process.env.JWT_SECRET, {
        expiresIn: "5y", // Token expires in 5 years
    });

    return res.status(200).json({
        status: "Success",
        message: "Login Successful",
        data: {
            token,
            expiration: new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000), // 5 years
            userDetails: {
                id: user._id,
                username: user.username,
                email: user.email,
                phoneNumber: user.phoneNumber,
                roles: rolesString,
            },
            userPermissions: userPermissions.data,
        },
    });
} catch (error) {
    console.error("Login Error: ", error);
    return res.status(500).json({ status: "Failed", message: "An error occurred during login", error: error.message });
}


  //-----------------OLD CODE
//   try {
//     const { username, password } = model;
//     if( !username || !password || !(username && password) ){
//       throw new ApiErrorResponse(StatusCodes.BAD_REQUEST, "Please provide valid username & password")
//     }
//     // Find user in MongoDB
//     const user = await AspNetUsers.findOne({ UserName: username });

//     if (!user) {
//         throw new ApiErrorResponse(StatusCodes.BAD_REQUEST, "Invalid username or password");
//     }

//     // Compare password with hashed password in DB
//     const isMatch = await user.isValidPassword(password);
//     if (!isMatch) {
//       throw new ApiErrorResponse(StatusCodes.BAD_REQUEST, "Invalid username or password");
//     }

//     const accessToken = await user.generateAccessToken();
//     const refreshToken = await user.generateRefreshToken();

//     return {
//         status: "Success",
//         message: "Login successful",
//         accessToken: accessToken,
//         refreshToken: refreshToken
//     };
// } catch (error) {
//     throw error;
// }

}


//---------------RegisterQuery---------->

export const RegisterQuery = async (model) => {
  try {
    // Check if user already exists
    const userExists = await AspNetUsers.findOne({ UserName: model.username });

    if (userExists) {
      throw new ApiErrorResponse(StatusCodes.CONFLICT, "User already exists!");
    }

    // Create new user
    const newUser = new AspNetUsers({
      Id: model.id,
      UserName: model.username,
      Email: model.email,
      PasswordHash: model.password,
      // securityStamp: new Date().toISOString(),
      // role: model.role || "user", // Default role if none provided
    });

    // Save user to database
    const savedNewUser = await newUser.save();
    if (!savedNewUser) {
      throw new ApiErrorResponse(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to create a new user."
      );
    }

    return savedNewUser;
    // return res.status(StatusCodes.CREATED).json(new ApiSuccessResponse(true, StatusCodes.CREATED, "User created successfully!", savedNewUser))
  } catch (err) {
    throw err;
    // const error = new Error(err.message);
    // error.status = err.statusCode || StatusCodes.BAD_REQUEST;
    // return next(error);
  }
};

//-------------GetUserPermissionQuery-------->

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
          from: "Menu",
          localField: "MenuId",
          foreignField: "MenuId",
          as: "menuDetails",
        },
      },
      { $unwind: {
        path: "$menuDetails",
        preserveNullAndEmptyArrays: true
      } },
      {
        $match: {
          RoleId: roleId,
          IsView: true,
          "menuDetails.IsMenu": true,
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

export const AddUpdateUserPermissionMasterQuery = async (
  userId,
  userPermission
) => {
  try {
    const deleted = await UserPermission.deleteMany({ UserId: userId });
    console.log("userId: ", userId);
    console.log("userPermission: ", userPermission);

    const newPermissions = userPermission.map((permission) => ({
      UserId: permission.userId,
      ParentId: permission.parentId,
      MenuId: permission.menuId,
      IsAdd: permission.isAdd || false,
      IsDel: permission.isDel || false,
      IsEdit: permission.isEdit || false,
      IsExport: permission.isExport || false,
      IsPost: permission.isPost || false,
      IsPrint: permission.isPrint || false,
      IsRelease: permission.isRelease || false,
      IsView: permission.isView || false,
    }));

    if (newPermissions.length === 0) {
      return {
        isSuccess: false,
        statusCode: StatusCodes.NOT_IMPLEMENTED,
        message: "No permission found",
      };
    }

    const result = await UserPermission.insertMany(newPermissions);

    console.log("result for permissoon", result);
    return {
      isSuccess: true,
      statusCode: StatusCodes.OK,
      message: "User Permission Details updated successfully",
      data: result,
    };
  } catch (error) {
    return {
      isSuccess: false,
      statusCode: error.statusCode || StatusCodes.BAD_REQUEST,
      message: error.message,
    };
  }
};

//////////////////////////////////////////////  GetUserPermissionMaster  ////////////////////////////////////////////////////////////////

export const GetUserPermissionMasterQuery = async (modal) => {
  try {
    const { userId } = modal;

    if (userId === "-1") {
      const usersPermission = await UserPermission.find().lean();

      return {
        isSuccess: true,
        statusCode: StatusCodes.OK,
        message: "User Permission Details fetched successfully",
        data: usersPermission,
        rowCount: usersPermission.length,
      };
    } else {
      const data = await UserPermission.aggregate([
        {
          $match: {
            UserId: userId,
          },
        },
        {
          $lookup: {
            from: "Menu", // MenuMasters collection name
            localField: "MenuId",
            foreignField: "MenuId",
            as: "menuDetails",
          },
        },
        { $unwind: "$menuDetails" }, // Flatten the menuDetails array
        {
          $lookup: {
            from: "Menu",
            localField: "ParentId",
            foreignField: "MenuId",
            as: "parentMenuDetails",
          },
        },
        { $unwind:{
          path: "$parentMenuDetails",
          preserveNullAndEmptyArrays: true,}
         },
        {
          $project: {
            UserId: 1,
            MenuId: 1,
            MenuName: "$menuDetails.MenuName",
            ParentId: 1,
            ParentMenuName: "$parentMenuDetails.MenuName",
            IsAdd: 1,
            IsEdit: 1,
            IsDel: 1,
            IsView: 1,
            IsPrint: 1,
            IsExport: 1,
            IsRelease: 1,
            IsPost: 1,
          },
        },
      ]);

      return {
        isSuccess: true,
        statusCode: StatusCodes.OK,
        message: "User Permission Details fetched successfully",
        data: data,
        rowCount: data.length,
      };
    }
  } catch (error) {
    return {
      isSuccess: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message,
    };
  }
};

//////////////////////////////////////////////  GetUserPermissionList  ////////////////////////////////////////////////////////////////

export const GetUserPermissionListQuery = async (modal) => {
  try {
    const { userId } = modal;

    const userPermissions = await UserPermission.aggregate([
      {
        $match: {
          UserId: userId,
        },
      },
      {
        $group: {
          _id: "$UserId", // Group by UserId
        },
      },
      {
        $lookup: {
          from: "AspNetUsers", // Collection name for users
          localField: "_id", // Field in the UserPermission collection
          foreignField: "Id", // Matching field in the users collection
          as: "userDetails",
        },
      },
      {
        $unwind:{ 
          path:"$userDetails",
          preserveNullAndEmptyArrays: false
        }
        },
      {
        $lookup: {
          from: "EmpMaster", // Collection name for role masters
          localField: "userDetails.Id", // Field in the users collection
          foreignField: "UserId", // Matching field in the role masters collection
          as: "roleDetails",
        },
      },
      {
        $unwind: {
          path: "$roleDetails",
        preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          UserId: '$_id',
         RoleId: '$roleDetails.RoleId',
         UserName: '$userDetails.UserName',
        },
      },
    ]);

    return {
      isSuccess: true,
      statusCode: StatusCodes.OK,
      message: "User Permission List fetched successfully",
      data: userPermissions,
    };
  } catch (error) {
    return {
      isSuccess: "failed",
      statusCode: 500,
      message: error.message,
    };
  }
};

//////////////////////////////////////////////  DeleteUserPermissionMaster  ////////////////////////////////////////////////////////////////

export const DeleteUserPermissionMasterQuery = async (modal) => {
  try {
    const { userId } = modal;

    const permissions = await UserPermission.find({ UserId: userId });

    if (permissions.length > 0) {
      await UserPermission.deleteMany({ UserId: userId });

      return {
        isSuccess: true,
        statusCode: StatusCodes.OK,
        message: `UserId ${userId} Successfully deleted`,
      };
    } else {
      return {
        isSuccess: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: `UserId ${userId} does not exist`,
      };
    }
  } catch (error) {
    return {
      isSuccess: false,
      statusCode: StatusCodes.NOT_FOUND,
      message: error.message,
    };
  }
};

//////////////////////////////////////////////  AddUpdateRoleMaster  ////////////////////////////////////////////////////////////////

export const AddUpdateRoleMasterQuery = async (modal) => {
  const { roleId, roleName,normalizedRoleName,rolePermissions } = modal;
  try {
    let roleMaster = await AspNetRoles.findOne({Id: roleId });

    // Check if the role exists
    if (roleMaster) {
      // Role exists, update it
      roleMaster.roleName = roleName;
      roleMaster.NormalizedName = roleName.toUpperCase(); // You can customize this
      roleMaster.modifyDt = new Date();

      await roleMaster.save();

      // Remove old permissions and add new ones
      await RolePermission.deleteMany({RoleId: roleId });
      const permissions = rolePermissions.map(permission => ({
        ...permission,
        roleId
      }));

      await RolePermission.insertMany(permissions);

      return{
        isSuccess: true,
        statusCode: StatusCodes.OK,
        message: `Role ${roleName} updated successfully`,
      }
    } else {
      // Role doesn't exist, create a new role
      const newRoleMaster = new AspNetRoles({
        Id: crypto.randomUUID(),
        Name:roleName,
        NormalizedName: normalizedRoleName
      });

      const newRole  = await newRoleMaster.save();

      // Insert permissions
      const permissions = rolePermissions.map(permission => ({
        ...permission,
        roleId: newRoleMaster.roleId
      }));

      await RolePermission.insertMany(permissions);

     return{
       isSuccess: true,
       statusCode: StatusCodes.OK,
       message: `Role ${roleName} created successfully`,
       data:newRole

      }
     }
    
  } catch (err) {
   return{
     isSuccess: false,
     statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
     message: err.message,
   }
  }
  };


//////////////////////////////////////////////  GetRoleMaster  ////////////////////////////////////////////////////////////////

export const GetRoleMasterQuery = async () => {
  try {
    const roles = await AspNetRoles.find().sort({ Name: 1 });

    return {
      isSuccess: true,
      statusCode: StatusCodes.OK,
      message: "Roles fetched successfully",
      data: roles,
      rowCount: roles.length,
    };
  } catch (error) {
    return {
      isSuccess: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message,
    };
  }
};

//////////////////////////////////////////////  Delete / RoleMaster  ////////////////////////////////////////////////////////////////

export const DeleteRoleMasterQuery = async (modal) => {
  try {
    const { RoleID } = modal;
    const roleExists = await AspNetRoles.findOne({ RoleID: RoleID });

    if (!roleExists) {
      return {
        isSuccess: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: `RoleID  Not Found!`,
      };
    }

    // Delete the role
    await AspNetRoles.findOneAndDelete({ RoleID: RoleID });

    await RolePermission.deleteMany({ RoleID: RoleID });

    return {
      isSuccess: true,
      statusCode: StatusCodes.OK,
      message: `RoleID  deleted successfully`,
    };
  } catch (error) {
    return {
      isSuccess: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message,
    };
  }
};

//////////////////////////////////////////////  AddUpdate / RolePermissionMaster  ////////////////////////////////////////////////////////////////

export const AddUpdateRolePermissionMasterQuery = async (modal) => {
  try {
    const { roleId } = modal;

    // Validation: RoleId required
    if (!roleId || roleId === "0") {
       return{
        isSuccess: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "Role ID is required",
       }
    }

    // Check if role exists
    let role = await RolePermission.findOne({ RoleId:roleId });

    if (role) {
        // Update role
        role.RoleId = roleId;
        await role.save();
        return{
          isSuccess: true,
          statusCode: StatusCodes.OK,
          message: "Role details updated successfully",
          data: role,
        }
    } else {
        // Generate new RoleId
        let tempZoneID = 1;
        if (modal.roleId === "-1" || modal.roleId === "0") {
            const maxRole = await RolePermission.find().sort({ RoleId: -1 }).limit(1);
            tempZoneID = maxRole.length ? parseInt(maxRole[0].RoleId) + 1 : 1;
        }

        // Create new role
        const newRole = new RolePermission({ RoleId: tempZoneID.toString() });
        await newRole.save();

        return{
          isSuccess: true,
          statusCode: StatusCodes.OK,
          message: `Successfully Created RoleID ${tempZoneID}`,
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
};

//////////////////////////////////////////////  Get / RolePermissionMaster  ////////////////////////////////////////////////////////////////

export const GetRolePermissionMasterQuery = async (modal) => {
  try {
    const { RoleId } = modal;

    if (RoleId === "-1") {
      const data = await RolePermission.find({}).lean();

      return {
        isSuccess: true,
        statusCode: StatusCodes.OK,
        message: "Role Permission fetched successfully",
        data: data,
      };
    } else {
      const data = await RolePermission.findOne({ RoleId: RoleId }).lean();
      return {
        isSuccess: "success",
        statusCode: StatusCodes.OK,
        message: `RoleID ${data.RoleId} Details of Role Permission fetched successfully`,
        data: data,
      };
    }
  } catch (error) {
    return {
      isSuccess: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message,
    };
  }
};

//////////////////////////////////////////////  Get / RolePermission  ////////////////////////////////////////////////////////////////

export const GetRolePermissionQuery = async () => {
  try {
    const aggregationPipeline = [
      {
        $match: {
          IsMenu: true,
        },
      },
      {
        $lookup: {
          from: "RolePermission",
          localField: "MenuId",
          foreignField: "MenuId",
          as: "rolepermissions",
        },
      },
      {
        $unwind: {
          path: "$rolepermissions",
          preserveNullAndEmptyArrays: true, // Optional, based on your data
        },
      },
      {
        $project: {
          MenuId: 1,
          MenuName: 1,
          ParentId: 1,
          IsAdd: {
            $ifNull: [{ $arrayElemAt: ["$role_permissions.IsAdd", 0] }, false],
          },
          IsEdit: {
            $ifNull: [{ $arrayElemAt: ["$role_permissions.IsEdit", 0] }, false],
          },
          IsDel: {
            $ifNull: [{ $arrayElemAt: ["$role_permissions.IsDel", 0] }, false],
          },
          IsView: {
            $ifNull: [{ $arrayElemAt: ["$role_permissions.IsView", 0] }, false],
          },
          IsPrint: {
            $ifNull: [
              { $arrayElemAt: ["$role_permissions.IsPrint", 0] },
              false,
            ],
          },
          IsExport: {
            $ifNull: [
              { $arrayElemAt: ["$role_permissions.IsExport", 0] },
              false,
            ],
          },
          IsRelease: {
            $ifNull: [
              { $arrayElemAt: ["$role_permissions.IsRelease", 0] },
              false,
            ],
          },
          IsPost: {
            $ifNull: [{ $arrayElemAt: ["$role_permissions.IsPost", 0] }, false],
          },
        },
      },
      {
        $sort: { MenuName: 1 },
      },
    ];

    // Execute aggregation query
    const result = await Menu.aggregate(aggregationPipeline);

    if (result.length > 0) {
      return {
        isSuccess: true,
        statusCode: StatusCodes.OK,
        message: "Role permissions fetched successfully",
        data: result,
      };
    } else {
      return {
        isSuccess: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "No menu permissions found!",
      };
    }
  } catch (error) {
    return {
      isSuccess: false,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message,
    };
  }
};
